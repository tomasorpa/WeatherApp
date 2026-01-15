import type { Coord } from '@/api/types'
import { useQuery } from '@tanstack/react-query'

export const useWeather = (coordinates: Coord | null) => {
    useQuery({
        queryKey
    })
  return (
    <div>use-weather</div>
  )
}
