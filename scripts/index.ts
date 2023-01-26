export function outTime(time: number, precision: number = 1): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor((time % 60) * 10 ** precision) / 10 ** precision;
    return `${hours > 0 ? `${hours}:` : ""}${
      minutes < 10 && hours > 0 ? "0" : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }