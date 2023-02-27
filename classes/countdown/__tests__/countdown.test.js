const Countdown = require('../countdown');

describe('Countdown class tests', () => {
    test('inheritance tests', () => {
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
            hours: 10,
            minutes: 10,
            seconds: 10,
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

    test('countdown creation less then 3 params test', () => {
        const countdown1 = new Countdown({ seconds: 20 });
        expect(countdown1.seconds).toBe(20);

        const countdown2 = new Countdown({ minutes: 10 });
        expect(countdown2.minutes).toBe(10);

        const countdown3 = new Countdown({ hours: 5 });
        expect(countdown3.hours).toBe(5);

        const countdown4 = new Countdown({ seconds: 30, minutes: 20 });
        expect(countdown4.seconds).toBe(30);
        expect(countdown4.minutes).toBe(20);

        const countdown5 = new Countdown({ minutes: 10, hours: 15 });
        expect(countdown5.minutes).toBe(10);
        expect(countdown5.hours).toBe(15);

        const countdown6 = new Countdown({ hours: 20, seconds: 5 });
        expect(countdown6.hours).toBe(20);
        expect(countdown6.seconds).toBe(5);
    });

    describe('start & pause & stop & reset methods tests', () => {
        const testCallBack = () => {};

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
            let bool = false;

            function boolCallBack() {
                bool = true;
            }

            const countdown = new Countdown({ seconds: 10 });
            const timeoutSeconds = 15;

            countdown.start(boolCallBack);
            expect(countdown.toString()).toBe('00:00:10');
            expect(bool).toBeFalsy();

            setTimeout(() => {
                expect(countdown.toString()).toBe('00:00:00');
                expect(bool).toBeTruthy();
            }, timeoutSeconds * 1000);
        });

        test('countdown started, then using start method multiple times, this should not interrupt the initial interval started', () => {
            const countdown = new Countdown({ hours: 10, minutes: 0, seconds: 20 });
            expect(countdown.toString()).toBe('10:00:20');
            const timeoutSeconds1 = 2000;
            const timeoutSeconds2 = timeoutSeconds1 + 2000;
            const timeoutSeconds3 = timeoutSeconds2 + 2000;
            countdown.start(testCallBack);

            setTimeout(() => {
                countdown.start(testCallBack);
                expect(countdown.toString()).toBe('10:00:18');
                countdown.start(testCallBack);
            }, timeoutSeconds1);

            setTimeout(() => {
                expect(countdown.toString()).toBe('10:00:16');
                countdown.start(testCallBack);
            }, timeoutSeconds2);

            setTimeout(() => {
                countdown.start(testCallBack);
                expect(countdown.toString()).toBe('10:00:14');
            }, timeoutSeconds3);
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
                }, timeoutSeconds * 1000);
            }
        );

        test('countdown "01:30:30" starts, pause after 5 seconds: "01:30:25", then to make sure it paused countdown checked again after 5 seconds', () => {
            const countdown = new Countdown({
                hours: 1,
                minutes: 30,
                seconds: 30,
            });
            expect(countdown.toString()).toBe('01:30:30');
            const timeoutSeconds1 = 5000;
            const timeoutSeconds2 = timeoutSeconds1 + 5000;
            countdown.start(testCallBack);

            setTimeout(() => {
                countdown.pause();
                expect(countdown.toString()).toBe('01:30:25');
            }, timeoutSeconds1);

            setTimeout(() => {
                expect(countdown.toString()).toBe('01:30:25');
            }, timeoutSeconds2);
        });

        test('countdown "00:20:20" starts, after 5 seconds pause & start to make sure the pause is not changing the countdown', () => {
            const countdown = new Countdown({
                hours: 0,
                minutes: 20,
                seconds: 20,
            });
            countdown.start(testCallBack);
            expect(countdown.toString()).toBe('00:20:20');

            setTimeout(() => {
                countdown.pause();
                countdown.start(testCallBack);
                expect(countdown.toString()).toBe('00:20:15');
            }, 5000);
        });

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

        test('countdown "01:30:30" starts, stop after 5 seconds: "01:30:25", then to make sure it stopped countdown checked again after 5 seconds', () => {
            const countdown = new Countdown({
                hours: 1,
                minutes: 30,
                seconds: 30,
            });
            expect(countdown.toString()).toBe('01:30:30');
            const timeoutSeconds1 = 5000;
            const timeoutSeconds2 = timeoutSeconds1 + 5000;
            countdown.start(testCallBack);

            setTimeout(() => {
                countdown.stop();
                expect(countdown.toString()).toBe('01:30:25');
            }, timeoutSeconds1);

            setTimeout(() => {
                expect(countdown.toString()).toBe('01:30:25');
            }, timeoutSeconds2);
        });

        test('countdown "00:20:20" starts, after 5 seconds stop & start to make sure the stop is reseting countdown at next start', () => {
            const countdown = new Countdown({
                hours: 0,
                minutes: 20,
                seconds: 20,
            });
            countdown.start(testCallBack);
            expect(countdown.toString()).toBe('00:20:20');

            setTimeout(() => {
                countdown.stop();
                countdown.start(testCallBack);
                expect(countdown.toString()).toBe('00:00:00');
            }, 5000);
        });

        test('countdown: 00:00:30 auto pauses after reaching "00:00:00"', () => {
            const countdown = new Countdown({
                hours: 0,
                minutes: 0,
                seconds: 30,
            });
            const maxLimit = '00:00:00';
            countdown.start(testCallBack);

            setTimeout(() => {
                expect(countdown.toString()).toBe(maxLimit);
            }, 60 * 1000);
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
