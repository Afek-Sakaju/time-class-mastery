const Clock = require('../clock');

describe('Clock class tests', () => {
    describe('valid cases', () => {
        describe('start & pause methods tests', () => {
            beforeAll(() => {
                jest.useFakeTimers();
            });

            afterEach(() => {
                jest.runAllTimers();
            });

            test.each([
                [{ seconds: 0, minutes: 0, hours: 2 }, '02:00:15'],
                [{ seconds: 0, minutes: 30, hours: 0 }, '00:30:15'],
                [{ seconds: 45, minutes: 0, hours: 0 }, '00:01:00'],
                [{ seconds: 10, minutes: 30, hours: 1 }, '01:30:25'],
            ])(
                'clock of %s units, autoStart set to true then after 15 seconds returns %s',
                (params, result) => {
                    const clock = new Clock(params);

                    setTimeout(() => {
                        expect(clock.toString()).toBe(result);
                    }, 15000);
                }
            );

            test.each([
                [{ seconds: 0, minutes: 0, hours: 2 }, '02:00:20'],
                [{ seconds: 0, minutes: 30, hours: 0 }, '00:30:20'],
                [{ seconds: 45, minutes: 0, hours: 0 }, '00:01:05'],
                [{ seconds: 10, minutes: 30, hours: 1 }, '01:30:30'],
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
                [{ seconds: 0, minutes: 0, hours: 2 }, '02:00:10'],
                [{ seconds: 0, minutes: 30, hours: 0 }, '00:30:10'],
                [{ seconds: 45, minutes: 0, hours: 0 }, '00:00:55'],
                [{ seconds: 10, minutes: 30, hours: 1 }, '01:30:20'],
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

        describe('clock creation with autoStart true tests', () => {});

        describe('clock creation with autoStart false tests', () => {});

        describe('clock max seconds validation tests', () => {});
        // plan if the text are correct and how to write them
        // before starting writing them
    });

    describe('invalid cases', () => {
        // not sure if there are invalid cases to check here since
        // most invalid cases covered in time tests
    });
});
