const Clock = require('../clock');

describe('Clock class tests', () => {
    test('inheritance tests', () => {
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
            hours: 10,
            minutes: 10,
            seconds: 10,
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

    test('clock creation less then 3 params test', () => {
        const clock1 = new Clock({ seconds: 20 });
        expect(clock1.seconds).toBe(20);

        const clock2 = new Clock({ minutes: 10 });
        expect(clock2.minutes).toBe(10);

        const clock3 = new Clock({ hours: 5 });
        expect(clock3.hours).toBe(5);

        const clock4 = new Clock({ seconds: 30, minutes: 20 });
        expect(clock4.seconds).toBe(30);
        expect(clock4.minutes).toBe(20);

        const clock5 = new Clock({ minutes: 10, hours: 15 });
        expect(clock5.minutes).toBe(10);
        expect(clock5.hours).toBe(15);

        const clock6 = new Clock({ hours: 20, seconds: 5 });
        expect(clock6.hours).toBe(20);
        expect(clock6.seconds).toBe(5);
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

        test('clock started, then using start method multiple times, this should not interrupt the initial interval started', () => {
            const clock = new Clock({ hours: 10, minutes: 0, seconds: 20 });
            expect(clock.toString()).toBe('10:00:20');
            const timeoutSeconds1 = 2000;
            const timeoutSeconds2 = timeoutSeconds1 + 2000;
            const timeoutSeconds3 = timeoutSeconds2 + 2000;
            clock.start();

            setTimeout(() => {
                clock.start();
                expect(clock.toString()).toBe('10:00:22');
                clock.start();
            }, timeoutSeconds1);

            setTimeout(() => {
                expect(clock.toString()).toBe('10:00:24');
                clock.start();
            }, timeoutSeconds2);

            setTimeout(() => {
                clock.start();
                expect(clock.toString()).toBe('10:00:26');
            }, timeoutSeconds3);
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

        test('clock: "00:30:00" created, autoStart set to false, after 200 seconds returns same clock', () => {
            const clock = new Clock({ hours: 0, minutes: 30, seconds: 0 }, false);
            expect(clock.toString()).toBe('00:30:00');

            setTimeout(() => {
                expect(clock.toString()).toBe('00:30:00');
            }, 200 * 1000);
        });

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
                hours: 23,
                minutes: 59,
                seconds: 50,
            });
            const maxLimit = '00:00:05';

            setTimeout(() => {
                expect(clock.toString()).toBe(maxLimit);
            }, 15 * 1000);
        });

        test('clock "01:30:30" starts, pause after 5 seconds: "01:30:35", then to make sure it paused clock checked again after 5 seconds', () => {
            const clock = new Clock({
                hours: 1,
                minutes: 30,
                seconds: 30,
            });
            expect(clock.toString()).toBe('01:30:30');
            const timeoutSeconds1 = 5000;
            const timeoutSeconds2 = timeoutSeconds1 + 5000;
            clock.start();

            setTimeout(() => {
                clock.pause();
                expect(clock.toString()).toBe('01:30:35');
            }, timeoutSeconds1);

            setTimeout(() => {
                expect(clock.toString()).toBe('01:30:35');
            }, timeoutSeconds2);
        });

        test('clock "00:20:20" starts, after 5 seconds pause & start to make sure the pause is not changing the clock', () => {
            const clock = new Clock({
                seconds: 20,
                minutes: 20,
                hours: 0,
            });
            expect(clock.toString()).toBe('00:20:20');

            setTimeout(() => {
                clock.pause();
                clock.start();
                expect(clock.toString()).toBe('00:20:25');
            }, 5000);
        });

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
                const timeoutSeconds1 = timeoutSeconds * 1000;
                const timeoutSeconds2 = timeoutSeconds1 + 1000;

                setTimeout(() => {
                    clock.reset();
                    expect(clock.toString()).toBe(result);
                }, timeoutSeconds1);

                setTimeout(() => {
                    /* this timeout added to make sure that reset method 
                    doesn't stop the clock's interval */
                    expect(clock.toString()).toBe('00:00:01');
                }, timeoutSeconds2);
            }
        );
    });

    describe('gt & gte & lt & lte methods tests', () => {
        test.each([
            [
                '02:00:05', // clock1
                '00:00:00', // clock2
                true,
                false,
                { hours: 2, minutes: 0, seconds: 5 },
                { hours: 24, minutes: 0, seconds: 0 },
            ],
            [
                '20:00:00', // clock1
                '19:50:50', // clock2
                true,
                false,
                { hours: 20, minutes: 0, seconds: 0 },
                { hours: 19, minutes: 50, seconds: 50 },
            ],
            [
                '00:20:00', // clock1
                '00:00:00', // clock2
                true,
                false,
                { hours: 0, minutes: 20, seconds: 0 },
                { hours: 0, minutes: 0, seconds: 0 },
            ],
            [
                '00:00:20', // clock1
                '00:00:10', // clock2
                true,
                false,
                { hours: 0, minutes: 0, seconds: 20 },
                { hours: 0, minutes: 0, seconds: 10 },
            ],
            [
                '00:00:00', // clock1
                '02:00:05', // clock2
                false,
                true,
                { hours: 24, minutes: 0, seconds: 0 },
                { hours: 2, minutes: 0, seconds: 5 },
            ],
            [
                '19:50:50', // clock1
                '20:00:00', // clock2
                false,
                true,
                { hours: 19, minutes: 50, seconds: 50 },
                { hours: 20, minutes: 0, seconds: 0 },
            ],
            [
                '00:00:00', // clock1
                '00:20:00', // clock2
                false,
                true,
                { hours: 0, minutes: 0, seconds: 0 },
                { hours: 0, minutes: 20, seconds: 0 },
            ],
            [
                '00:00:10', // clock1
                '00:00:20', // clock2
                false,
                true,
                { hours: 0, minutes: 0, seconds: 10 },
                { hours: 0, minutes: 0, seconds: 20 },
            ],
        ])(
            'clock1 %s using gt method with clock2 %s, returns %s, using lt method returns %s',
            (currentClock1, currentClock2, isGt, isLt, paramsClock1, paramsClock2) => {
                const clock1 = new Clock(paramsClock1);
                expect(clock1.toString()).toBe(currentClock1);

                const clock2 = new Clock(paramsClock2);
                expect(clock2.toString()).toBe(currentClock2);

                expect(clock1.gt(clock2)).toBe(isGt);
                expect(clock1.lt(clock2)).toBe(isLt);
            }
        );

        test.each([
            [
                '20:00:00', // clock1
                '19:50:50', // clock2
                true,
                false,
                { hours: 20, minutes: 0, seconds: 0 },
                { hours: 19, minutes: 50, seconds: 50 },
            ],
            [
                '00:00:20', // clock1
                '00:00:10', // clock2
                true,
                false,
                { hours: 0, minutes: 0, seconds: 20 },
                { hours: 0, minutes: 0, seconds: 10 },
            ],
            [
                '00:00:20', // clock1
                '00:00:20', // clock2
                true,
                true,
                { hours: 0, minutes: 0, seconds: 20 },
                { hours: 0, minutes: 0, seconds: 20 },
            ],
            [
                '21:30:15', // clock1
                '21:30:15', // clock2
                true,
                true,
                { hours: 21, minutes: 30, seconds: 15 },
                { hours: 21, minutes: 30, seconds: 15 },
            ],
            [
                '00:00:00', // clock1
                '00:00:00', // clock2
                true,
                true,
                { hours: 0, minutes: 0, seconds: 0 },
                { hours: 0, minutes: 0, seconds: 0 },
            ],
            [
                '19:50:50', // clock1
                '20:00:00', // clock2
                false,
                true,
                { hours: 19, minutes: 50, seconds: 50 },
                { hours: 20, minutes: 0, seconds: 0 },
            ],
            [
                '00:00:00', // clock1
                '00:20:00', // clock2
                false,
                true,
                { hours: 0, minutes: 0, seconds: 0 },
                { hours: 0, minutes: 20, seconds: 0 },
            ],
        ])(
            'clock1 %s using gte method with clock2 %s, returns %s, then using lte method returns %s',
            (currentClock1, currentClock2, isGte, isLte, paramsClock1, paramsClock2) => {
                const clock1 = new Clock(paramsClock1);
                expect(clock1.toString()).toBe(currentClock1);

                const clock2 = new Clock(paramsClock2);
                expect(clock2.toString()).toBe(currentClock2);

                expect(clock1.gte(clock2)).toBe(isGte);
                expect(clock1.lte(clock2)).toBe(isLte);
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

        expect(() => {
            new Clock({ hours: 10 }, 'hulio123');
        }).toThrow(Error('Boolean element must be true or false'));

        expect(() => {
            new Clock({ hours: 10 }, 999);
        }).toThrow(Error('Boolean element must be true or false'));

        expect(() => {
            new Clock({ hours: 10 }, { afek: 'sakaju' });
        }).toThrow(Error('Boolean element must be true or false'));

        expect(() => {
            new Clock({ hours: 10 }, [{ 1: 2 }, { 10: 20 }]);
        }).toThrow(Error('Boolean element must be true or false'));
    });
});
