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

        clock1.addHours(21);
        expect(clock1.hours).toBe(0); // clock reset after "23:59:59"

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
        /* clock1 - 11:11:11
        clock2 is - 10:10:10
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

    test('clock creation with no params test, should be same as current time', () => {
        const clock = new Clock();
        const currentDate = new Date();

        expect(currentDate.getHours()).toBe(clock.hours);
        expect(currentDate.getMinutes()).toBe(clock.minutes);
        expect(currentDate.getSeconds()).toBe(clock.seconds);
    });

    describe('start & pause methods tests', () => {
        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.runOnlyPendingTimers();
            /* jest had bug with running some of the tests.
            the solution here was to change the function 
            "jest.runAllTimers()" to "jest.runOnlyPendingTimers()" */
        });

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, 15, '02:00:15', '02:00:00'],
            [{ hours: 0, minutes: 30, seconds: 0 }, 60, '00:31:00', '00:30:00'],
            [{ hours: 0, minutes: 0, seconds: 45 }, 30, '00:01:15', '00:00:45'],
            [{ hours: 1, minutes: 30, seconds: 10 }, 3600, '02:30:10', '01:30:10'],
        ])(
            'clock of %s units, autoStart set to true by default then after %s seconds returns %s',
            (params, timeoutSeconds, result, current) => {
                const clock = new Clock(params);
                expect(clock.toString()).toBe(current);

                setTimeout(() => {
                    expect(clock.toString()).toBe(result);
                }, timeoutSeconds * 1000);
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, 15, '02:00:00', '02:00:00'],
            [{ hours: 0, minutes: 30, seconds: 0 }, 150, '00:30:00', '00:30:00'],
            [{ hours: 0, minutes: 0, seconds: 45 }, 9999, '00:00:45', '00:00:45'],
            [{ hours: 1, minutes: 30, seconds: 10 }, 100, '01:30:10', '01:30:10'],
        ])(
            'clock of %s units, autoStart set to false then after %s seconds returns %s',
            (params, timeoutSeconds, result, current) => {
                const clock = new Clock(params, false);
                expect(clock.toString()).toBe(current);

                setTimeout(() => {
                    expect(clock.toString()).toBe(result);
                }, timeoutSeconds * 1000);
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, 20, '02:00:20', '02:00:00'],
            [{ hours: 0, minutes: 30, seconds: 0 }, 40, '00:30:40', '00:30:00'],
            [{ hours: 0, minutes: 0, seconds: 45 }, 3600, '01:00:45', '00:00:45'],
            [{ hours: 1, minutes: 30, seconds: 10 }, 120, '01:32:10', '01:30:10'],
            [{ hours: 26, minutes: 0, seconds: 0 }, 20, '02:00:20', '02:00:00'],
        ])(
            'clock of %s units, activates start method then after %s seconds returns %s',
            (params, timeoutSeconds, result, current) => {
                const clock = new Clock(params, false);
                expect(clock.toString()).toBe(current);

                clock.start();

                setTimeout(() => {
                    expect(clock.toString()).toBe(result);
                }, timeoutSeconds * 1000);
            }
        );

        test('clock: 23:59:50 resets and continue to count after reaching "23:59:59"', () => {
            const clock = new Clock({
                seconds: 50,
                minutes: 59,
                hours: 23,
            });
            const timeoutSeconds = 15;
            const maxLimit = '00:00:05';

            setTimeout(() => {
                expect(clock.toString()).toBe(maxLimit);
            }, timeoutSeconds * 1000);
        });

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, 10, '02:00:10', '02:00:00'],
            [{ hours: 0, minutes: 30, seconds: 0 }, 60, '00:31:00', '00:30:00'],
            [{ hours: 0, minutes: 0, seconds: 45 }, 5, '00:00:50', '00:00:45'],
            [{ hours: 1, minutes: 30, seconds: 10 }, 0, '01:30:10', '01:30:10'],
        ])(
            'clock of %s units, start method active, after %s seconds using pause method returns %s',
            (params, timeoutSeconds, result, current) => {
                const clock = new Clock(params);
                expect(clock.toString()).toBe(current);

                setTimeout(() => {
                    clock.pause();
                    expect(clock.toString()).toBe(result);
                }, timeoutSeconds * 1000);
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, 10, '00:00:00', '02:00:00'],
            [{ hours: 0, minutes: 30, seconds: 0 }, 100, '00:00:00', '00:30:00'],
            [{ hours: 0, minutes: 0, seconds: 45 }, 1200, '00:00:00', '00:00:45'],
            [{ hours: 1, minutes: 30, seconds: 10 }, 5, '00:00:00', '01:30:10'],
        ])(
            'clock of %s units, start method active, after %s seconds using reset method, then returns %s',
            (params, timeoutSeconds, result, current) => {
                const clock = new Clock(params);
                expect(clock.toString()).toBe(current);

                setTimeout(() => {
                    clock.reset();
                    expect(clock.toString()).toBe(result);
                }, timeoutSeconds * 1000);

                setTimeout(() => {
                    /* this timeout added to make sure that reset method 
                    doesn't stop the clock's interval */
                    expect(clock.toString()).toBe('00:00:01');
                }, timeoutSeconds * 1000 + 1000);
            }
        );
    });

    test('invalid cases - inheritance of parameter validation', () => {
        const clock = new Clock({ hours: 10, minutes: 15, seconds: 20 });

        expect(() => {
            new Clock({ hours: 'bob', minutes: 5, seconds: 10 });
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            new Clock({ hours: 5, minutes: { a: 'a' }, seconds: 10 });
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            new Clock({ hours: 5, minutes: 10, seconds: [1, 1, 1] });
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
