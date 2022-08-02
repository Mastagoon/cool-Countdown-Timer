import type { NextPage } from "next"
import dayjs, { Dayjs } from "dayjs"
import { useEffect, useState } from "react"

const Home: NextPage = () => {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [countDown, setCountDown] = useState(0)
  const [endDate, setEndDate] = useState(dayjs())
  const [isRunning, setIsRunning] = useState(false)

  let interval: NodeJS.Timeout

  const dateToTime = (d: Dayjs): number => dayjs(d).diff(dayjs(), "seconds")

  const timeToDate = (t: number): Dayjs => dayjs().add(t, "seconds")

  useEffect(() => {
    // on load
    const isRunning = localStorage.getItem("isRunning")
    if (isRunning) {
      setIsRunning(true)
      setEndDate(dayjs(localStorage.getItem("endDate")))
    } else {
      // not running
      setIsRunning(!!localStorage.getItem("isRunning"))
      setCountDown(Number(localStorage.getItem("countDown")))
    }
    document.title = "Chill Bank"
  }, [])

  useEffect(() => {
    // when end date changes, set the counter
    if (isRunning) setCountDown(dateToTime(endDate))
    localStorage.setItem("endDate", endDate.toString())
  }, [endDate])

  useEffect(() => {
    // counter
    if (isRunning) {
      interval = setInterval(() => {
        setCountDown((countDown) => countDown - 1)
      }, 1000)
    }
    localStorage.setItem("isRunning", isRunning ? "true" : "")
    return () => {
      clearInterval(interval)
    }
  }, [isRunning])

  useEffect(() => {
    // update UI based on countdown
    // the counter is in seconds
    if (countDown < 0) {
      setCountDown(0)
      setIsRunning(false)
    }
    setHours(Math.floor((countDown / 3600) % 3600))
    setMinutes(Math.floor((countDown / 60) % 60))
    setSeconds(Math.floor(countDown % 60))
    if (countDown)
      localStorage.setItem(
        "countDown",
        countDown > 0 ? countDown.toString() : "0"
      )
  }, [countDown])

  const start = (): void => {
    // starting
    // we have a countdown, but no end date
    // calculate the end date based on countdown and then start
    setEndDate(timeToDate(countDown))
    setIsRunning(true)
  }

  const stop = (): void => {
    // stopping
    // we have an accurate end date, and no accurate countdown
    // re-initiate the counter based on the time left to the end date and then stop
    // clearInterval(interval)
    setCountDown(dateToTime(endDate))
    setIsRunning(false)
  }

  const addHour = () => {
    if (isRunning) setEndDate(endDate.add(1, "hour"))
    else setCountDown(countDown + 3600)
  }
  const addFiveMins = () => {
    if (isRunning) setEndDate(endDate.add(5, "minutes"))
    else setCountDown(countDown + 300)
  }
  const reset = () => {
    setCountDown(0)
    setEndDate(dayjs())
    stop()
  }

  return (
    <div className="app">
      <div className={`time-circle ${!isRunning ? "paused" : ""}`}>
        <div className="time">
          {`${hours.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
          })}:${minutes.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
          })}:${seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`}
        </div>
      </div>
      <div className="buttons">
        {isRunning ? (
          <button className="play-pause" onClick={stop}>
            Stop
          </button>
        ) : (
          <button className="play-pause" onClick={start}>
            Start
          </button>
        )}
        <div className="row w-100">
          <button className="reset" onClick={addHour}>
            Add Hour
          </button>
          <button className="reset" onClick={addFiveMins}>
            Add 5 Minutes
          </button>
          <button className="reset" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
