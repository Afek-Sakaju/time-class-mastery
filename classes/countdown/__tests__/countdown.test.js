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

        countdown1.reset();
        expect(countdown1.totalSeconds).toBe(0);

        const countdown2 = new Countdown({
            seconds: 10,
            minutes: 10,
            hours: 10,
        }); // 10:10:10

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
        /* countdown1 is :11:11:11, countdown2 is :10:10:10 
                    11:11:11 - 10:10:10 = 01:01:01 (3661 totalSeconds) */
        expect(countdown1.totalSeconds).toBe(3661);

        countdown1.resetHours();
        expect(countdown1.hours).toBe(0);

        countdown1.resetMinutes();
        expect(countdown1.minutes).toBe(0);

        countdown1.resetSeconds();
        expect(countdown1.seconds).toBe(0);

        expect(countdown1.toString()).toBe('00:00:00');
    });

    describe('start & pause & stop & resetCountdown methods tests', () => {
        const tempCallBack = () => {
            let i = 0;
        };

        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.runAllTimers();
        });

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, '02:00:00', '01:59:45'],
            [{ hours: 0, minutes: 30, seconds: 0 }, '00:30:00', '00:29:45'],
            [{ hours: 0, minutes: 0, seconds: 45 }, '00:00:45', '00:00:30'],
            [{ hours: 1, minutes: 30, seconds: 10 }, '01:30:10', '01:29:55'],
            [{ hours: 100, minutes: 0, seconds: 5 }, '23:59:59', '23:59:44'],
        ])(
            'countdown of %s units, activating start method, after 15 seconds returns %s',
            (params, current, result) => {
                const countdown = new Countdown(params);
                countdown.start(tempCallBack);
                expect(countdown.toString()).toBe(current);

                setTimeout(() => {
                    expect(countdown.toString()).toBe(result);
                }, 15000);
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, '02:00:00', '01:59:50'],
            [{ hours: 0, minutes: 30, seconds: 0 }, '00:30:00', '00:29:50'],
            [{ hours: 0, minutes: 0, seconds: 45 }, '00:00:45', '00:00:35'],
            [{ hours: 1, minutes: 30, seconds: 10 }, '01:30:10', '01:30:00'],
        ])(
            'countdown of %s units, starting countdown, after 10 seconds activating pause, returns %s',
            (params, current, result) => {
                const countdown = new Countdown(params);
                countdown.start(tempCallBack);
                expect(countdown.toString()).toBe(current);

                setTimeout(() => {
                    countdown.pause();
                }, 10000);

                setTimeout(() => {
                    // to make sure the pause method indeed stopped the interval
                    expect(countdown.toString()).toBe(result);
                }, 11000);
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, '02:00:00', '01:59:50'],
            [{ hours: 0, minutes: 30, seconds: 0 }, '00:30:00', '00:29:50'],
            [{ hours: 0, minutes: 0, seconds: 45 }, '00:00:45', '00:00:35'],
            [{ hours: 1, minutes: 30, seconds: 10 }, '01:30:10', '01:30:00'],
            [{ hours: 80, minutes: 80, seconds: 80 }, '23:59:59', '23:59:49'],
        ])(
            'countdown of %s units, starting countdown, after 10 seconds, activating pause method and start again, then returns %s',
            (params, current, result) => {
                const countdown = new Countdown(params);
                countdown.start(tempCallBack);
                expect(countdown.toString()).toBe(current);

                setTimeout(() => {
                    countdown.pause();
                }, 10000);

                setTimeout(() => {
                    // to make sure the stop method indeed stopped the interval
                    countdown.start(tempCallBack);
                    expect(countdown.toString()).toBe(result);
                }, 15000);
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, '02:00:00', '02:00:00'],
            [{ hours: 0, minutes: 30, seconds: 0 }, '00:30:00', '00:30:00'],
            [{ hours: 0, minutes: 0, seconds: 45 }, '00:00:45', '00:00:45'],
            [{ hours: 1, minutes: 30, seconds: 10 }, '01:30:10', '01:30:10'],
        ])(
            'countdown of %s units, starting countdown, after 20 seconds activating resetCountdown, returns %s',
            (params, current, result) => {
                const countdown = new Countdown(params);
                countdown.start(tempCallBack);
                expect(countdown.toString()).toBe(current);

                setTimeout(() => {
                    countdown.resetCountdown();
                    expect(countdown.toString()).toBe(result);
                }, 20000);
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, '02:00:00', '01:59:50'],
            [{ hours: 0, minutes: 30, seconds: 0 }, '00:30:00', '00:29:50'],
            [{ hours: 0, minutes: 0, seconds: 45 }, '00:00:45', '00:00:35'],
            [{ hours: 1, minutes: 30, seconds: 10 }, '01:30:10', '01:30:00'],
        ])(
            'countdown of %s units, starting countdown, after 10 seconds activating stop, returns %s',
            (params, current, result) => {
                const countdown = new Countdown(params);
                countdown.start(tempCallBack);
                expect(countdown.toString()).toBe(current);

                setTimeout(() => {
                    countdown.stop();
                }, 10000);

                setTimeout(() => {
                    // to make sure the stop method indeed stopped the interval
                    expect(countdown.toString()).toBe(result);
                }, 11000);
            }
        );

        test.each([
            [{ hours: 2, minutes: 0, seconds: 0 }, '02:00:00', '02:00:00'],
            [{ hours: 0, minutes: 30, seconds: 0 }, '00:30:00', '00:30:00'],
            [{ hours: 0, minutes: 0, seconds: 45 }, '00:00:45', '00:00:45'],
            [{ hours: 1, minutes: 30, seconds: 10 }, '01:30:10', '01:30:10'],
        ])(
            'countdown of %s units, starting countdown, after 10 seconds, activating stop method and start again, then returns %s',
            (params, current, result) => {
                const countdown = new Countdown(params);
                countdown.start(tempCallBack);
                expect(countdown.toString()).toBe(current);

                setTimeout(() => {
                    countdown.stop();
                }, 10000);

                setTimeout(() => {
                    // to make sure the stop method indeed stopped the interval
                    countdown.start(tempCallBack);
                    expect(countdown.toString()).toBe(result);
                }, 11000);
            }
        );

        test('countdown: 00:00:30 auto pauses after reaching "00:00:00"', () => {
            const countdown = new Countdown({
                seconds: 30,
                minutes: 0,
                hours: 0,
            });
            countdown.start(tempCallBack);
            const maxLimit = '00:00:00';

            setTimeout(() => {
                expect(countdown.toString()).toBe(maxLimit);
            }, 60000);
        });

        test('countdown: 00:00:00 auto pauses', () => {
            const countdown = new Countdown({
                seconds: 0,
                minutes: 0,
                hours: 0,
            });
            countdown.start(tempCallBack);
            const maxLimit = '00:00:00';

            setTimeout(() => {
                expect(countdown.toString()).toBe(maxLimit);
            }, 60000);
        });
    });

    test('invalid cases - inheritance of parameter validation', () => {
        const countdown = new Countdown({
            hours: 10,
            minutes: 15,
            seconds: 20,
        });

        expect(() => {
            new Countdown({ hours: 'bob', minutes: { a: 'a' }, seconds: [6] });
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

    describe('countdown max seconds validation tests', () => {});
    // plan if the text are correct and how to write them
    // before starting writing them
});
