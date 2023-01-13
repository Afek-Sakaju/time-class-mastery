const Stopper = require('../stopper');

describe('Stopper class tests', () => {
    describe('valid cases', () => {
        describe('start & pause & stop methods tests', () => {
            /*beforeEach(()=>{
                    jest.runAllTimers();

            *** not working that way, only after each setTimeout manually
            
            })*/

            jest.useFakeTimers();

            test.each([
                [{ seconds: 0, minutes: 0, hours: 2 }, '02:00:00'],
                [{ seconds: 0, minutes: 30, hours: 0 }, '00:30:00'],
                [{ seconds: 45, minutes: 0, hours: 0 }, '00:00:45'],
                [{ seconds: 10, minutes: 30, hours: 1 }, '01:30:10'],
            ])(
                'stopper of %s units, autoStart set to false then after 15 seconds returns %s',
                (params, result) => {
                    const stopper = new Stopper(params, false);

                    setTimeout(() => {
                        expect(stopper.toString()).toBe(result);
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
                'stopper of %s units, activates start method then after 20 seconds returns %s',
                (params, result) => {
                    const stopper = new Stopper(params, false);
                    stopper.start();

                    setTimeout(() => {
                        expect(stopper.toString()).toBe(result);
                    }, 20000);
                    jest.runAllTimers();
                }
            );

            test('stopper: 00:00:30 auto pauses after reaching "00:00:00"', () => {
                const stopper = new Stopper(
                    {
                        seconds: 30,
                        minutes: 0,
                        hours: 0,
                    },
                    true
                );
                const maxLimit = '00:00:00';

                setTimeout(() => {
                    expect(stopper.toString()).toBe(maxLimit);
                }, 60000);
                jest.runAllTimers();
            });

            test.each([
                [{ seconds: 0, minutes: 0, hours: 2 }, '01:59:50'],
                [{ seconds: 0, minutes: 30, hours: 0 }, '00:29:50'],
                [{ seconds: 45, minutes: 0, hours: 0 }, '00:00:35'],
                [{ seconds: 10, minutes: 30, hours: 1 }, '01:30:00'],
            ])(
                'stopper of %s units, start method active, after 10 seconds using pause method returns %s',
                (params, result) => {
                    const stopper = new Stopper(params, true);

                    setTimeout(() => {
                        stopper.pause();
                    }, 10000);
                    jest.runAllTimers();

                    expect(stopper.toString()).toBe(result);
                }
            );

            test.each([
                [{ seconds: 0, minutes: 0, hours: 2 }, '02:00:00'],
                [{ seconds: 0, minutes: 30, hours: 0 }, '00:30:00'],
                [{ seconds: 45, minutes: 0, hours: 0 }, '00:00:45'],
                [{ seconds: 10, minutes: 30, hours: 1 }, '01:30:10'],
            ])(
                'stopper of %s units, start method active, after 20 seconds using stop method returns %s',
                (params, result) => {
                    const stopper = new Stopper(params, true);

                    setTimeout(() => {
                        stopper.stop();
                    }, 20000);
                    jest.runAllTimers();

                    expect(stopper.toString()).toBe(result);
                }
            );
        });

        describe('stopper creation with autoStart true tests', () => {});

        describe('stopper creation with autoStart false tests', () => {});

        describe('stopper max seconds validation tests', () => {});
        // plan if the text are correct and how to write them
        // before starting writing them
    });

    describe('invalid cases', () => {
        // not sure if there are invalid cases to check here since
        // most invalid cases covered in time tests
    });
});
