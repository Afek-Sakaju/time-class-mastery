const Countdown = require('../countdown');

describe('Countdown class tests', () => {
    describe('valid cases', () => {
        describe('start & pause & stop methods tests', () => {
            jest.useFakeTimers();

            test.each([
                [{ seconds: 0, minutes: 0, hours: 2 }, '02:00:00', '02:00:00'],
                [{ seconds: 0, minutes: 30, hours: 0 }, '00:30:00', '00:30:00'],
                [{ seconds: 45, minutes: 0, hours: 0 }, '00:00:45', '00:00:45'],
                [
                    { seconds: 10, minutes: 30, hours: 1 },
                    '01:30:10',
                    '01:30:10',
                ],
            ])(
                'countdown of %s units, autoStart set to false then after 15 seconds returns %s',
                (params, current, result) => {
                    const countdown = new Countdown(params, false);
                    expect(countdown.toString()).toBe(current);

                    setTimeout(() => {
                        expect(countdown.toString()).toBe(result);
                    }, 15000);
                    jest.runAllTimers();
                }
            );

            test.each([
                [{ seconds: 0, minutes: 0, hours: 2 }, '01:59:40'],
                [{ seconds: 0, minutes: 30, hours: 0 }, '00:29:40'],
                [{ seconds: 45, minutes: 0, hours: 0 }, '00:00:25'],
                [{ seconds: 20, minutes: 30, hours: 1 }, '01:30:00'],
            ])(
                'countdown of %s units, activates start method then after 20 seconds returns %s',
                (params, result) => {
                    const countdown = new Countdown(params, false);
                    countdown.start();

                    setTimeout(() => {
                        expect(countdown.toString()).toBe(result);
                    }, 20000);
                    jest.runAllTimers();
                }
            );

            test('countdown: 00:00:30 auto pauses after reaching "00:00:00"', () => {
                const countdown = new Countdown(
                    {
                        seconds: 30,
                        minutes: 0,
                        hours: 0,
                    },
                    true
                );
                const maxLimit = '00:00:00';

                setTimeout(() => {
                    expect(countdown.toString()).toBe(maxLimit);
                }, 60000);
                jest.runAllTimers();
            });

            test.each([
                [{ seconds: 0, minutes: 0, hours: 2 }, '01:59:50'],
                [{ seconds: 0, minutes: 30, hours: 0 }, '00:29:50'],
                [{ seconds: 45, minutes: 0, hours: 0 }, '00:00:35'],
                [{ seconds: 10, minutes: 30, hours: 1 }, '01:30:00'],
            ])(
                'countdown of %s units, start method active, after 10 seconds using pause method returns %s',
                (params, result) => {
                    const countdown = new Countdown(params, true);

                    setTimeout(() => {
                        countdown.pause();
                    }, 10000);
                    jest.runAllTimers();

                    expect(countdown.toString()).toBe(result);
                }
            );

            test.each([
                [{ seconds: 0, minutes: 0, hours: 2 }, '02:00:00'],
                [{ seconds: 0, minutes: 30, hours: 0 }, '00:30:00'],
                [{ seconds: 45, minutes: 0, hours: 0 }, '00:00:45'],
                [{ seconds: 10, minutes: 30, hours: 1 }, '01:30:10'],
            ])(
                'countdown of %s units, start method active, after 20 seconds using stop method returns %s',
                (params, result) => {
                    const countdown = new Countdown(params, true);

                    setTimeout(() => {
                        countdown.stop();
                    }, 20000);
                    jest.runAllTimers();

                    expect(countdown.toString()).toBe(result);
                }
            );
        });

        describe('countdown creation with autoStart true tests', () => {});

        describe('countdown creation with autoStart false tests', () => {});

        describe('countdown max seconds validation tests', () => {});
        // plan if the text are correct and how to write them
        // before starting writing them
    });

    describe('invalid cases', () => {
        // not sure if there are invalid cases to check here since
        // most invalid cases covered in time tests
    });
});
