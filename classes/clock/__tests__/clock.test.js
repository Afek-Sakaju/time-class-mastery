const Clock = require('../clock');

describe('Clock class tests', () => {
    test('inheretance tests', () => {
        const clock1 = new Clock({ hours: 0, minutes: 0, seconds: 0 });

        clock1.addSeconds(5);
        expect(clock1.seconds).toBe(5);

        clock1.addMinutes(10);
        expect(clock1.minutes).toBe(10);

        clock1.addHours(3);
        expect(clock1.hours).toBe(3);

        clock1.addHours(100);
        expect(clock1.totalSeconds).toBe(Clock.MAX_CLOCK_SECONDS);

        clock1.reset();
        expect(clock1.totalSeconds).toBe(0);

        const clock2 = new Clock({
            seconds: 10,
            minutes: 10,
            hours: 10,
        }); // 10:10:10

        clock1.addTime(clock2);
        expect(clock1.totalSeconds).toBe(clock2.totalSeconds);

        clock1.subSeconds(5);
        expect(clock1.seconds).toBe(5);

        clock1.subMinutes(9);
        expect(clock1.minutes).toBe(1);

        clock1.subHours(3);
        expect(clock1.hours).toBe(7);

        clock1.subHours(200);
        expect(clock1.totalSeconds).toBe(Clock.MIN_CLOCK_SECONDS);

        clock1.hours = 11;
        expect(clock1.hours).toBe(11);

        clock1.minutes = 11;
        expect(clock1.minutes).toBe(11);

        clock1.seconds = 11;
        expect(clock1.seconds).toBe(11);

        clock1.subTime(clock2);
        /* clock1 is :11:11:11, clock2 is :10:10:10 
                11:11:11 - 10:10:10 = 01:01:01 (3661 totalSeconds) */
        expect(clock1.totalSeconds).toBe(3661);

        clock1.resetHours();
        expect(clock1.hours).toBe(0);

        clock1.resetMinutes();
        expect(clock1.minutes).toBe(0);

        clock1.resetSeconds();
        expect(clock1.seconds).toBe(0);

        expect(clock1.toString()).toBe('00:00:00');
    });

    describe('start & pause methods tests', () => {
        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.runAllTimers();
        });

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, '02:00:15'],
            [{ hours: 0, minutes: 30, seconds: 0 }, '00:30:15'],
            [{ hours: 0, minutes: 0, seconds: 45 }, '00:01:00'],
            [{ hours: 1, minutes: 30, seconds: 10 }, '01:30:25'],
        ])(
            'clock of %s units, autoStart set to true by default then after 15 seconds returns %s',
            (params, result) => {
                const clock = new Clock(params);

                setTimeout(() => {
                    expect(clock.toString()).toBe(result);
                }, 15000);
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, '02:00:00'],
            [{ hours: 0, minutes: 30, seconds: 0 }, '00:30:00'],
            [{ hours: 0, minutes: 0, seconds: 45 }, '00:00:45'],
            [{ hours: 1, minutes: 30, seconds: 10 }, '01:30:10'],
        ])(
            'clock of %s units, autoStart set to false then after 15 seconds returns %s',
            (params, result) => {
                const clock = new Clock(params, false);

                setTimeout(() => {
                    expect(clock.toString()).toBe(result);
                }, 15000);
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, '02:00:20'],
            [{ hours: 0, minutes: 30, seconds: 0 }, '00:30:20'],
            [{ hours: 0, minutes: 0, seconds: 45 }, '00:01:05'],
            [{ hours: 1, minutes: 30, seconds: 10 }, '01:30:30'],
            [{ hours: 80, minutes: 80, seconds: 160 }, '23:59:59'],
        ])(
            'clock of %s units, activates start method then after 20 seconds returns %s',
            (params, result) => {
                const clock = new Clock(params, false);
                clock.start();

                setTimeout(() => {
                    expect(clock.toString()).toBe(result);
                }, 20000);
            }
        );

        test('clock: 23:59:50 auto pauses after reaching "23:59:59"', () => {
            const clock = new Clock({
                seconds: 50,
                minutes: 59,
                hours: 23,
            });
            const maxLimit = '23:59:59';

            setTimeout(() => {
                expect(clock.toString()).toBe(maxLimit);
            }, 30000);
        });

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, '02:00:10'],
            [{ hours: 0, minutes: 30, seconds: 0 }, '00:30:10'],
            [{ hours: 0, minutes: 0, seconds: 45 }, '00:00:55'],
            [{ hours: 1, minutes: 30, seconds: 10 }, '01:30:20'],
        ])(
            'clock of %s units, start method active, after 10 seconds using pause method returns %s',
            (params, result) => {
                const clock = new Clock(params);

                setTimeout(() => {
                    clock.pause();
                    expect(clock.toString()).toBe(result);
                }, 10000);
            }
        );
    });

    test('invalid cases - inheritance of parameter validation', () => {
        const clock = new Clock({ hours: 10, minutes: 15, seconds: 20 });

        expect(() => {
            new Clock({ hours: 'bob', minutes: { a: 'a' }, seconds: [6] });
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            clock.hours = [1, 2, 3];
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            clock.minutes = 'string';
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            clock.seconds = ['a', 'b', 'c'];
        }).toThrow(Error('Time element must be a valid number'));
    });
});
