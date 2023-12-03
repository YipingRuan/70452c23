import { isInRange, logTemplate, parseDate } from './utilities';
import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'

describe('isInRange', () => {
    it('Correctly determines if a number is within range considering integer constraints', () => {
        const cases = [
            { x: 1, min: 2, max: 3, isInteger: true, result: false },
            { x: 2, min: 2, max: 3, isInteger: true, result: true },
            { x: 2.1, min: 2, max: 3, isInteger: true, result: false }
        ]

        for (const c of cases) {
            expect(isInRange(c.x, c.min, c.max, c.isInteger)).toEqual(c.result);
        }
    });
})

describe('logTemplate', () => {
    it('Generate log prefix with function name and correlationId', () => {
        const testMethod123 = () => {};

        expect(logTemplate(testMethod123, "42")).toEqual("[testMethod123][42]");
    });
})

describe('parseDate', () => {
    it('Parse date string as format', () => {
        const format = "YYYY-MM-DD";
        const cases = [
            { x: "2023-12-05", result: dayjs.utc("2023-12-05") }
        ]

        for (const c of cases) {
            expect(parseDate(c.x, format)).toEqual(c.result);
        }
    });

    it('Handle wrong value', () => {
        const format = "YYYY-MM-DD";
        const cases = ["2023-12-0", "A", "2024-02-33"]

        for (const c of cases) {
            expect(parseDate(c, format)).toEqual(null);
        }
    });
})