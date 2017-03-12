/**
 * IGradings are provided in a list to the Duration.
 */
export interface IGrading {
    unit: string | ((x: number) => string);
    milliseconds: number;
}

export const millisecond: IGrading = { unit: '%ms', milliseconds: 1 };
export const second: IGrading = { unit: '%s', milliseconds: 1000 };
export const minute: IGrading = { unit: '%m', milliseconds: 60 * 1000 };
export const hour: IGrading = { unit: '%h', milliseconds: 60 * 60 * 1000 };
export const day: IGrading = { unit: '%d', milliseconds: 24 * 60 * 60 * 1000 };

/**
 * ISegments are the count of how many units are in each grading, returned
 * from the Duration's getSegments call.
 */
export interface ISegment {
    unit: string;
    count: number;
}

export class Duration {

    private _grading = [day, hour, minute, second];
    private _separator = ' ';

    constructor(private _duration: number) {}

    /**
     * Sets the grading used for handling durations.
     */
    public grading(grading: IGrading[]): this {
        this._grading = grading;
        return this;
    }

    /**
     * Sets the separator used between durations.
     */
    public separator(separator: string): this {
        this._separator = separator;
        return this;
    }

    /**
     * Returns the duration formatted into the given number of segments.
     */
    public segments(max = Infinity) {
        // 1. First pass, sort the parts and give them their own unit durations
        const sorted = this._grading.slice().sort((a, b) => a.milliseconds - b.milliseconds);
        if (sorted.length === 0) {
            return '';
        }

        let duration = this._duration / sorted[0].milliseconds;
        let parts = sorted.map((grade, i) => {
            if (i === sorted.length - 1) {
                return { grade, count: Math.floor(duration) };
            }
            const next = sorted[i + 1];
            const count = Math.floor(duration % Math.round(next.milliseconds / grade.milliseconds));
            duration /= next.milliseconds / grade.milliseconds;

            return { grade, count };
        });

        // 2. Second pass, filter out for the max number of segments.
        let started = false;
        parts = parts
            .reverse()
            .filter(metric => {
                if (max === 0) {
                    return false;
                }
                started = started || metric.count > 0;
                if (!started) {
                    return false;
                }

                max--;
                return true;
            });

        // 3. Get everything back in order and format the string.
        return this._grading
            .map(grade => parts.find(p => p.grade === grade))
            .filter(Boolean)
            .map(part => typeof part.grade.unit === 'function'
                ? part.grade.unit(part.count)
                : part.grade.unit.replace(/%/g, String(part.count)))
            .join(this._separator);
    }

    /**
     * Converts the duration to a string.
     */
    toString(segments?: number) {
        return this.segments(segments);
    }
}

export function fmt(duration: number) {
    return new Duration(duration);
}
