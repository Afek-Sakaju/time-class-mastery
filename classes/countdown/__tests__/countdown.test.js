const Countdown = require('../countdown');

describe('Countdown class tests', () => {
    test('inheretance tests', () => {
        const countdown1 = new Countdown({ hours: 0, minutes: 0, seconds: 0 });

        countdown1.addSeconds(5);
        expect(countdown1.seconds).toBe(5);

        countdown1.addMinutes(10);
        expect(countdown1.minutes).toBe(10);

        countdown1.addHours(3);
        expect(countdown1.hours).toBe(3);

        countdown1.addHours(100);
        expect(countdown1.totalSeconds).toBe(Countdown.MAX_COUNTDOWN_SECONDS);

        countdown1;

        const countdown2 = new Countdown({
            seconds: 10,
            minutes: 10,
            hours: 10,
        }); // 10:10:10

        countdown1.resetHours();
        expect(countdown1.hours).toBe(0);

        countdown1.resetMinutes();
        expect(countdown1.minutes).toBe(0);

        countdown1.resetSeconds();
        expect(countdown1.seconds).toBe(0);

        countdown1.addTime(countdown2);
        expect(countdown1.totalSeconds).toBe(countdown2.totalSeconds);

        countdown1.subSeconds(5);
        expect(countdown1.seconds).toBe(5);

        countdown1.subMinutes(9);
        expect(countdown1.minutes).toBe(1);

        countdown1.subHours(3);
        expect(countdown1.hours).toBe(7);

        countdown1.subHours(200);
        expect(countdown1.totalSeconds).toBe(Countdown.MIN_COUNTDOWN_SECONDS);

        countdown1.hours = 11;
        expect(countdown1.hours).toBe(11);

        countdown1.minutes = 11;
        expect(countdown1.minutes).toBe(11);

        countdown1.seconds = 11;
        expect(countdown1.seconds).toBe(11);

        countdown1.subTime(countdown2);
        /* countdown1 - 11:11:11
        countdown2 is - 10:10:10
        11:11:11 - 10:10:10 = 01:01:01 (3661 totalSeconds) */
        expect(countdown1.totalSeconds).toBe(3661);

        expect(countdown1.toString()).toBe('01:01:01');
    });

    test('countdown creation with no params test, should be same as current time', () => {
        const countdown = new Countdown();
        const currentDate = new Date();

        expect(currentDate.getHours()).toBe(countdown.hours);
        expect(currentDate.getMinutes()).toBe(countdown.minutes);
        expect(currentDate.getSeconds()).toBe(countdown.seconds);
    });

    describe('start & pause & stop & reset methods tests', () => {
        let bool = false;

        const testCallBack = () => {
            bool = true;
        };

        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.runOnlyPendingTimers();
            /* jest had bug with running some of the tests.
            the solution here was to change the function 
            "jest.runAllTimers()" to "jest.runOnlyPendingTimers()" */
        });

        test('callback activation after countdown has been finished', () => {
            /* This test should stay the first test after initializing "bool"
            because thats how we make sure he isn't modified by other tests 
            that activated the callback */
            const countdown = new Countdown({ seconds: 10 });
            const timeoutSeconds = 11;

            countdown.start(testCallBack);
            expect(countdown.toString()).toBe('00:00:10');

            setTimeout(() => {
                expect(countdown.toString()).toBe('00:00:00');
                expect(bool).toBeTruthy();
            }, timeoutSeconds * 1000);
        });

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, 15, '01:59:45', '02:00:00'],
            [{ hours: 0, minutes: 30, seconds: 0 }, 20, '00:29:40', '00:30:00'],
            [{ hours: 0, minutes: 0, seconds: 45 }, 30, '00:00:15', '00:00:45'],
            [{ hours: 1, minutes: 30, seconds: 10 }, 3600, '00:30:10', '01:30:10'],
            [{ hours: 100, minutes: 0, seconds: 5 }, 59, '99:59:00', '99:59:59'],
        ])(
            'countdown of %s units, using start method, after %s seconds returns %s',
            (params, timeoutSeconds, result, current) => {
                const countdown = new Countdown(params);
                countdown.start(testCallBack);
                expect(countdown.toString()).toBe(current);

                setTimeout(() => {
                    const res = countdown.toString();
                    expect(res).toBe(result);
                }, 1000 * timeoutSeconds);
            }
        );

        test('countdown "01:30:30" starts, after 5 seconds pause at "01:30:25", after another 5 seconds check if it still at "01:30:25"', () => {
            const countdown = new Countdown({
                seconds: 30,
                minutes: 30,
                hours: 1,
            });
            countdown.start();

            setTimeout(() => {
                countdown.pause();
                expect(countdown.toString()).toBe('01:30:25');
            }, 5000);

            setTimeout(() => {
                expect(countdown.toString()).toBe('01:30:25');
            }, 5000 * 2);
        });

        test.each([
            [
                { hours: 2, minutes: 0, seconds: 0 },
                120,
                '01:58:00',
                1,
                '01:57:59',
                '02:00:00',
            ],
            [
                { hours: 0, minutes: 30, seconds: 0 },
                10,
                '00:29:50',
                5,
                '00:29:45',
                '00:30:00',
            ],
            [
                { hours: 0, minutes: 0, seconds: 45 },
                0,
                '00:00:45',
                10,
                '00:00:35',
                '00:00:45',
            ],
            [
                { hours: 1, minutes: 30, seconds: 10 },
                7000,
                '00:00:00',
                60,
                '00:00:00',
                '01:30:10',
            ],
        ])(
            'countdown of %s units starts, after %s seconds pause on time:%s, start again for %s seconds, then returns %s',
            (params, timeoutSeconds1, result1, timeoutSeconds2, result2, current) => {
                const countdown = new Countdown(params);
                countdown.start(testCallBack);
                expect(countdown.toString()).toBe(current);

                setTimeout(() => {
                    countdown.pause();
                    expect(countdown.toString()).toBe(result1);
                    countdown.start();
                }, 1000 * timeoutSeconds1);

                setTimeout(() => {
                    expect(countdown.toString()).toBe(result2);

                    /* in this case i had to add another 1000ms due to 
                    the delay of jest between the two timeouts */
                }, 1000 + 1000 * (timeoutSeconds1 + timeoutSeconds2));
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, 20, '02:00:00', '02:00:00'],
            [{ hours: 0, minutes: 30, seconds: 0 }, 40, '00:30:00', '00:30:00'],
            [{ hours: 0, minutes: 0, seconds: 45 }, 99999, '00:00:45', '00:00:45'],
            [{ hours: 1, minutes: 30, seconds: 10 }, 3600, '01:30:10', '01:30:10'],
        ])(
            'countdown of %s units starts countdown, after %s seconds using reset, returns %s',
            (params, timeoutSeconds, result, current) => {
                const countdown = new Countdown(params);
                countdown.start(testCallBack);
                expect(countdown.toString()).toBe(current);

                setTimeout(() => {
                    countdown.reset();
                    expect(countdown.toString()).toBe(result);
                }, timeoutSeconds * 1000);
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, 10, '01:59:50', '02:00:00'],
            [{ hours: 0, minutes: 30, seconds: 0 }, 20, '00:29:40', '00:30:00'],
            [{ hours: 0, minutes: 0, seconds: 45 }, 300, '00:00:00', '00:00:45'],
            [{ hours: 1, minutes: 30, seconds: 10 }, 3600, '00:30:10', '01:30:10'],
        ])(
            'countdown of %s units starts countdown, after %s seconds using stop, returns %s',
            (params, timeoutSeconds, result, current) => {
                const countdown = new Countdown(params);
                countdown.start(testCallBack);
                expect(countdown.toString()).toBe(current);

                setTimeout(() => {
                    countdown.stop();

                    setTimeout(() => {
                        // to make sure the stop method indeed stopped the interval
                        expect(countdown.toString()).toBe(result);
                    }, 2000);
                }, timeoutSeconds * 1000);
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, 100, '02:00:00'],
            [{ hours: 0, minutes: 30, seconds: 0 }, 10, '00:30:00'],
            [{ hours: 0, minutes: 0, seconds: 45 }, 40, '00:00:45'],
            [{ hours: 1, minutes: 30, seconds: 10 }, 300, '01:30:10'],
        ])(
            'countdown of %s units starts countdown for %s seconds, then stop and start again, should return "00:00:00"',
            (params, timeoutSeconds, current) => {
                const countdown = new Countdown(params);
                countdown.start(testCallBack);
                expect(countdown.toString()).toBe(current);

                setTimeout(() => {
                    countdown.stop();

                    setTimeout(() => {
                        // to make sure the stop method indeed stopped the interval
                        countdown.start(testCallBack);
                        expect(countdown.toString()).toBe('00:00:00');
                    }, 2000);
                }, timeoutSeconds * 1000);
            }
        );

        test('countdown: 00:00:30 auto pauses after reaching "00:00:00"', () => {
            const countdown = new Countdown({
                seconds: 30,
                minutes: 0,
                hours: 0,
            });
            const timeoutSeconds = 60;
            const maxLimit = '00:00:00';
            countdown.start(testCallBack);

            setTimeout(() => {
                expect(countdown.toString()).toBe(maxLimit);
            }, timeoutSeconds * 1000);
        });
    });

    test('invalid cases - inheritance of parameter validation', () => {
        const countdown = new Countdown({
            hours: 10,
            minutes: 15,
            seconds: 20,
        });

        expect(() => {
            new Countdown({ hours: 'bob', minutes: 5, seconds: 10 });
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            new Countdown({ hours: 5, minutes: { a: 'a' }, seconds: 10 });
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            new Countdown({ hours: 5, minutes: 10, seconds: [1, 1, 1] });
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            countdown.hours = [1, 2, 3];
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            countdown.minutes = 'string';
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            countdown.seconds = ['a', 'b', 'c'];
        }).toThrow(Error('Time element must be a valid number'));
    });
});
