import * as dayjs from 'dayjs'
import { Dayjs } from 'dayjs'

export function parseDate(input: string, format: string): Dayjs | null {
    const output = dayjs(input, format);
    if (output.format(format) !== input) {
        return null;
    }

    return output;
}