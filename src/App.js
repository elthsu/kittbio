import React, {useState} from 'react';
import moment from "moment"
import './App.css';

function App() {
  const [page, setPage] = useState(1)
  const [usualWakeTime, setUsualWakeTime] = useState("")
  const [usualBedTime, setUsualBedTime] = useState("")
  const [flightLatest, setFlightLatest] = useState("")
  const [preferredWake, setPreferredWake] = useState("")
  const [preferredBed, setPreferredBed] = useState("")
  const [arrivalBed, setArrivalBed] = useState("")
  const [homeTimeZone, setHomeTimeZone] = useState("")
  const [destinationTimeZone, setDestinationTimeZone] = useState("")
  const [departureTime, setDepartureTime] = useState("")
  const [arrivalTime, setArrivalTime] = useState("")


  const [positiveResult, setPostiveResult] = useState(true)

  
  const handlePage = () => {
    setPage(page + 1)
  }

  const handlePageBack = () => {
    setPage(page - 1)
  }

  const handleInput = (e, setStateFunction) => {
    setStateFunction(e.target.value)
  }

  const handleKeyDown = (e) =>{
    if (e.key === "Enter"){
      setPage(page + 1)
    }
  }

  const handleReset = () => {
    setPage(1)
    setUsualWakeTime("")
    setUsualBedTime("")
    setFlightLatest("")
    setPreferredWake("")
    setPreferredBed("")
    setArrivalBed("")
    setHomeTimeZone("")
    setDestinationTimeZone("")
    setDepartureTime("")
    setArrivalTime("")
  }

  const handleGenerateResult = () => {
    let wakeuptime, bedtime, wakefullness, nextDay, napLength, napPlacement, napStart, napMidPoint, napEnd, napStartDestinationTimeZone, napEndDestinationTimeZone, napStartMod

    if(moment(usualWakeTime, 'H:mm').isBefore(moment(flightLatest, 'H:mm'))){
      wakeuptime = usualWakeTime
    }
    else {
      wakeuptime = flightLatest
    }

    if(moment(preferredBed, 'H:mm').isBefore(moment(arrivalBed, 'H:mm')) && +preferredBed.split(":")[0] > 10 && +arrivalBed.split(":")[0] > 10){
      bedtime = arrivalBed
      nextDay = false
    }
    else if (moment(arrivalBed, 'H:mm').isBefore(moment(preferredBed, 'H:mm')) && +arrivalBed.split(":")[0] < 10 && +preferredBed.split(":")[0] > 10) {
      bedtime = arrivalBed
      nextDay = true
    }
    else if (moment(arrivalBed, 'H:mm').isBefore(moment(preferredBed, 'H:mm')) && +arrivalBed.split(":")[0] < 10 && +preferredBed.split(":")[0] < 10) {
      bedtime = preferredBed
      nextDay = false
    }
    else if (moment(preferredBed, 'H:mm').isBefore(moment(arrivalBed, 'H:mm')) && +preferredBed.split(":")[0] < 10 && +arrivalBed.split(":")[0] < 10) {
      bedtime = arrivalBed
      nextDay = false
    }
    else if (moment(preferredBed, 'H:mm').isBefore(moment(arrivalBed, 'H:mm')) && +preferredBed.split(":")[0] < 10 && +arrivalBed.split(":")[0] > 10) {
      bedtime = preferredBed
      nextDay = false
    }
    else {
      bedtime = preferredBed
      nextDay = false
    }

    wakefullness = moment(departureTime, "H:mm").diff(moment(wakeuptime, "H:mm"), 'minutes') + moment(bedtime, "H:mm").diff(moment(arrivalTime, "H:mm"), 'minutes') + 1440

    if(moment(departureTime, "H:mm").isBefore(moment(arrivalTime, "H:mm"))){
      wakefullness += moment(arrivalTime, "H:mm").diff(moment(departureTime, "H:mm"), "minutes") - (Math.abs(+(destinationTimeZone.split(":")[0] - +homeTimeZone.split(":")[0])) * 60)
    }
    else {
      wakefullness += 1440 + (moment(arrivalTime, "H:mm").diff(moment(departureTime, "H:mm"), "minutes")) - (Math.abs(+(destinationTimeZone.split(":")[0] - +homeTimeZone.split(":")[0])) * 60)
    }

    if(wakefullness <= 1200){
      napLength = 0
    }
    else if(wakefullness <= 1440) {
      napLength = 60
    }
    else if(wakefullness <= 1680) {
      napLength = 120
    }
    else if(wakefullness <= 2160) {
      napLength = 240
    }
    else if(wakefullness <= 2520) {
      napLength = 360
    }
    else {
      napLength = 480
    }

    napPlacement = Math.abs(1440 + (moment(preferredWake, "H:mm").diff(moment(usualBedTime, "H:mm"), "minutes")) - (Math.abs(+(destinationTimeZone.split(":")[0] - +homeTimeZone.split(":")[0])) * 60))

    napPlacement = napPlacement / 2

    napMidPoint = moment(usualBedTime, "H:mm").add(napPlacement, "minutes").format("HH:mm")

    napStart = moment(napMidPoint, "H:mm").subtract(napLength/2, "minutes").format("HH:mm")

    napEnd = moment(napMidPoint, "H:mm").add(napLength/2, "minutes").format("HH:mm")

    napStartDestinationTimeZone = moment(napStart, "H:mm").add((Math.abs(+(destinationTimeZone.split(":")[0] - +homeTimeZone.split(":")[0])) * 60), "minutes").format("HH:mm")

    napEndDestinationTimeZone = moment(napEnd, "H:mm").add((Math.abs(+(destinationTimeZone.split(":")[0] - +homeTimeZone.split(":")[0])) * 60), "minutes").format("HH:mm")

    if(moment(napStart, "HH:mm").diff(moment(departureTime, "HH:mm"), "minutes") > -240 && moment(napStart, "HH:mm").diff(moment(departureTime, "HH:mm"), "minutes") < 60){
      napStartMod = true
    }
    else {
      napStartMod = false
    } 

    console.log(napStart, moment(departureTime, "HH:mm").subtract(4, "hours").format("HH:mm"), moment(departureTime, "HH:mm").add(1, "hours").format("HH:mm"))

    // console.log(moment(napStart, "HH:mm").isBetween(moment(departureTime, "HH:mm").subtract(4, "hours"), moment(departureTime, "HH:mm").add(1, "hours")))

    return (
      <>
      <div style={{fontWeight: "bold"}}>Output: {(!napStartMod) ? 'Yes, the nap can be placed without modifying the time.' : 'The nap cannot be placed without modifying the time.'}</div>
      { (positiveResult) 
          ? <> 
              <div>Nap Start Time: {napStart} GMT{homeTimeZone} / {napStartDestinationTimeZone} GMT{destinationTimeZone}</div>
              <div>Nap End Time: {napEnd} GMT{homeTimeZone} / {napEndDestinationTimeZone} GMT{destinationTimeZone}</div>
            </>
          : null
      }
      </>
    )
  }

  const pageContent = () => {
    switch (page) {
      case 1:
        return (
          <>
            <div style={{display:"flex", flexDirection:"row"}}>
              <img src="https://images.squarespace-cdn.com/content/v1/5c7a2fd37d0c9126da3d843c/1562803135324-WLCCTL6QR2HA88Y618GE/ke17ZwdGBToddI8pDm48kIpdYUXyUPp68j8r-94H55uoCXeSvxnTEQmG4uwOsdIceAoHiyRoc52GMN5_2H8WpyR2vltzBlW4Cyl67bitASHy9QBakoD0epjUgC2DFGLhLAF3UQuW-eMj1sczAxf9yA/favicon.ico?format=" className="App-logo" alt="logo" />
              <img src="https://images.squarespace-cdn.com/content/5c7a2fd37d0c9126da3d843c/1562803231536-FVRID9H0HA2Z90PZO5WM/KITT-BIO-logo.png?content-type=image%2Fpng" alt="title" />  
            </div>
            <button 
              onClick={handlePage}>
              start
            </button>
          </>
        )

      case 2:
        return (
          <>
            <div style={{display:"flex", flexDirection:"column"}}>
              <div>
                Please enter your USUAL WAKE TIME (HOME)
              </div>
              <input value={usualWakeTime} onChange={(e)=>handleInput(e, setUsualWakeTime)} type="textarea"/>

            </div>
            <button onClick={handlePage}>
              next
            </button>
          </>
        )

      case 3:
        return (
          <>
            <div style={{display:"flex", flexDirection:"column"}}>
              <div>
                Please enter your USUAL BED TIME (HOME)
              </div>
              <input value={usualBedTime} onChange={(e)=>handleInput(e, setUsualBedTime)} type="textarea"/>

            </div>
            <div style={{display:"flex", flexDirection:"row"}}>
              <button onClick={handlePageBack}>
                back
              </button>
              <button onClick={handlePage}>
                next
              </button>
            </div>
          </>
        )
      
      case 4:
        return (
          <>
            <div style={{display:"flex", flexDirection:"column"}}>
              <div>
                Please enter your FLIGHT DAY LATEST WAKE TIME
              </div>
              <input value={flightLatest} onChange={(e)=>handleInput(e, setFlightLatest)} type="textarea"/>

            </div>
            <div style={{display:"flex", flexDirection:"row"}}>
              <button onClick={handlePageBack}>
                back
              </button>
              <button onClick={handlePage}>
                next
              </button>
            </div>
          </>
        )
      
      case 5:
        return (
          <>
            <div style={{display:"flex", flexDirection:"column"}}>
              <div>
                Please enter your PREFERRED WAKE TIME (DESTINATION)
              </div>
              <input value={preferredWake} onChange={(e)=>handleInput(e, setPreferredWake)} type="textarea"/>

            </div>
            <div style={{display:"flex", flexDirection:"row"}}>
              <button onClick={handlePageBack}>
                back
              </button>
              <button onClick={handlePage}>
                next
              </button>
            </div>
          </>
        )

      case 6:
        return (
          <>
            <div style={{display:"flex", flexDirection:"column"}}>
              <div>
                Please enter your PREFERRED BED TIME (DESTINATION)
              </div>
              <input value={preferredBed} onChange={(e)=>handleInput(e, setPreferredBed)} type="textarea"/>

            </div>
            <div style={{display:"flex", flexDirection:"row"}}>
              <button onClick={handlePageBack}>
                back
              </button>
              <button onClick={handlePage}>
                next
              </button>
            </div>
          </>
        )
      
      case 7:
        return (
          <>
            <div style={{display:"flex", flexDirection:"column"}}>
              <div>
                Please enter your ARRIVAL DAY EARLIEST BED TIME 
              </div>
              <input value={arrivalBed} onChange={(e)=>handleInput(e, setArrivalBed)} type="textarea"/>

            </div>
            <div style={{display:"flex", flexDirection:"row"}}>
              <button onClick={handlePageBack}>
                back
              </button>
              <button onClick={handlePage}>
                next
              </button>
            </div>
          </>
        )

      case 8:
        return (
          <>
            <div style={{display:"flex", flexDirection:"column"}}>
              <div>
                Please enter your HOME TIME ZONE
              </div>
              <select value={homeTimeZone} onChange={(e)=>handleInput(e, setHomeTimeZone)}>
                <option></option>
                <option value="-12:00">(GMT -12:00) Eniwetok, Kwajalein</option>
                <option value="-11:00">(GMT -11:00) Midway Island, Samoa</option>
                <option value="-10:00">(GMT -10:00) Hawaii</option>
                <option value="-09:50">(GMT -9:30) Taiohae</option>
                <option value="-09:00">(GMT -9:00) Alaska</option>
                <option value="-08:00">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                <option value="-07:00">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                <option value="-06:00">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                <option value="-05:00">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                <option value="-04:50">(GMT -4:30) Caracas</option>
                <option value="-04:00">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                <option value="-03:50">(GMT -3:30) Newfoundland</option>
                <option value="-03:00">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                <option value="-02:00">(GMT -2:00) Mid-Atlantic</option>
                <option value="-01:00">(GMT -1:00) Azores, Cape Verde Islands</option>
                <option value="+00:00">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                <option value="+01:00">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>
                <option value="+02:00">(GMT +2:00) Kaliningrad, South Africa</option>
                <option value="+03:00">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                <option value="+03:50">(GMT +3:30) Tehran</option>
                <option value="+04:00">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                <option value="+04:50">(GMT +4:30) Kabul</option>
                <option value="+05:00">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                <option value="+05:50">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
                <option value="+05:75">(GMT +5:45) Kathmandu, Pokhara</option>
                <option value="+06:00">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                <option value="+06:50">(GMT +6:30) Yangon, Mandalay</option>
                <option value="+07:00">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                <option value="+08:00">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
                <option value="+08:75">(GMT +8:45) Eucla</option>
                <option value="+09:00">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                <option value="+09:50">(GMT +9:30) Adelaide, Darwin</option>
                <option value="+10:00">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                <option value="+10:50">(GMT +10:30) Lord Howe Island</option>
                <option value="+11:00">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                <option value="+11:50">(GMT +11:30) Norfolk Island</option>
                <option value="+12:00">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                <option value="+12:75">(GMT +12:45) Chatham Islands</option>
                <option value="+13:00">(GMT +13:00) Apia, Nukualofa</option>
                <option value="+14:00">(GMT +14:00) Line Islands, Tokelau</option>
              </select>

            </div>
            <div style={{display:"flex", flexDirection:"row"}}>
              <button onClick={handlePageBack}>
                back
              </button>
              <button onClick={handlePage}>
                next
              </button>
            </div>
          </>
        )
      
      case 9:
        return (
          <>
            <div style={{display:"flex", flexDirection:"column"}}>
              <div>
                Please enter your DESTINATION TIME ZONE
              </div>
              <select value={destinationTimeZone} onChange={(e)=>handleInput(e, setDestinationTimeZone)}>
                <option></option>
                <option value="-12:00">(GMT -12:00) Eniwetok, Kwajalein</option>
                <option value="-11:00">(GMT -11:00) Midway Island, Samoa</option>
                <option value="-10:00">(GMT -10:00) Hawaii</option>
                <option value="-09:50">(GMT -9:30) Taiohae</option>
                <option value="-09:00">(GMT -9:00) Alaska</option>
                <option value="-08:00">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                <option value="-07:00">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                <option value="-06:00">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                <option value="-05:00">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                <option value="-04:50">(GMT -4:30) Caracas</option>
                <option value="-04:00">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                <option value="-03:50">(GMT -3:30) Newfoundland</option>
                <option value="-03:00">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                <option value="-02:00">(GMT -2:00) Mid-Atlantic</option>
                <option value="-01:00">(GMT -1:00) Azores, Cape Verde Islands</option>
                <option value="+00:00">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                <option value="+01:00">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>
                <option value="+02:00">(GMT +2:00) Kaliningrad, South Africa</option>
                <option value="+03:00">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                <option value="+03:50">(GMT +3:30) Tehran</option>
                <option value="+04:00">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                <option value="+04:50">(GMT +4:30) Kabul</option>
                <option value="+05:00">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                <option value="+05:50">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
                <option value="+05:75">(GMT +5:45) Kathmandu, Pokhara</option>
                <option value="+06:00">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                <option value="+06:50">(GMT +6:30) Yangon, Mandalay</option>
                <option value="+07:00">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                <option value="+08:00">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
                <option value="+08:75">(GMT +8:45) Eucla</option>
                <option value="+09:00">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                <option value="+09:50">(GMT +9:30) Adelaide, Darwin</option>
                <option value="+10:00">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                <option value="+10:50">(GMT +10:30) Lord Howe Island</option>
                <option value="+11:00">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                <option value="+11:50">(GMT +11:30) Norfolk Island</option>
                <option value="+12:00">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                <option value="+12:75">(GMT +12:45) Chatham Islands</option>
                <option value="+13:00">(GMT +13:00) Apia, Nukualofa</option>
                <option value="+14:00">(GMT +14:00) Line Islands, Tokelau</option>
              </select>
            </div>
            <div style={{display:"flex", flexDirection:"row"}}>
              <button onClick={handlePageBack}>
                back
              </button>
              <button onClick={handlePage}>
                next
              </button>
            </div>
          </>
        )

      case 10:
        return (
          <>
            <div style={{display:"flex", flexDirection:"column"}}>
              <div>
                Please enter your FLIGHT DEPARTURE/ARRIVAL TIME
              </div>
              <label style={{marginTop: "20px"}}>DEPARTURE TIME</label>
              <input style={{marginTop: "10px"}} value={departureTime} onChange={(e)=>handleInput(e, setDepartureTime)} type="textarea"/>
              <label style={{marginTop: "20px"}}>ARRIVAL TIME</label>
              <input style={{marginTop: "10px"}} value={arrivalTime} onChange={(e)=>handleInput(e, setArrivalTime)} type="textarea"/>

            </div>
            <div style={{display:"flex", flexDirection:"row"}}>
              <button onClick={handlePageBack}>
                back
              </button>
              <button onClick={handlePage}>
                next
              </button>
            </div>
          </>
        )

      case 11:
        return (
          <>
            <div style={{display:"flex", flexDirection:"column"}}>
              <div style={{marginBottom: "50px"}}>
                RESULT:
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems: "start"}}>
                <div>Usual Wake Time (Home): {usualWakeTime}</div>
                <div>Usual Bed Time (Home): {usualBedTime}</div>
                <div>Flight Day Latest Wake Time: {flightLatest}</div>
                <div>Preferred Wake Time (Destination): {preferredWake}</div>
                <div>Preferred Bed Time (Destination): {preferredBed}</div>
                <div>Arrival Day Earliest Bed Time: {arrivalBed}</div>
                <div>Home Time Zone: GMT{homeTimeZone}</div>
                <div>Destination Time Zone: GMT{destinationTimeZone}</div>
                <div style={{display:"flex", flexDirection:"column", alignItems: "start"}}>
                  Flight Departure/Arrival Time:
                  <div style={{marginLeft: '50px'}}>Depart: {departureTime}</div>
                  <div style={{marginLeft: '50px'}}>Arrive: {arrivalTime}</div>
                </div>
                <div style={{marginTop: "50px", display:"flex", flexDirection:"column", alignItems: "start"}}>
                  {
                    handleGenerateResult()
                  }
                </div>
              </div>
            </div>
            <div style={{display:"flex", flexDirection:"row"}}>
              <button onClick={handleReset}>
                reset
              </button>
            </div>
          </>
        )
      
      default:
        break;
    }
  }

  return (
    <div className="App" onKeyDown={handleKeyDown}>
      <header className="App-header">
        {pageContent()}
      </header>
    </div>
  );
}

export default App;
