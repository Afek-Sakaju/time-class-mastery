const Stopper = require('../stopper');

describe('Stopper class tests', () => {
    test('inheretance tests', () => {
        const stopper1 = new Stopper();

        stopper1.addSeconds(5);
        expect(stopper1.seconds).toBe(5);

        stopper1.addMinutes(10);
        expect(stopper1.minutes).toBe(10);

        stopper1.addHours(3);
        expect(stopper1.hours).toBe(3);

        stopper1.addHours(100);
        expect(stopper1.totalSeconds).toBe(Stopper.MAX_STOPPER_SECONDS);

        stopper1.reset();
        expect(stopper1.totalSeconds).toBe(0);

        const stopper2 = new Stopper();
        stopper2.addHours(10);
        stopper2.addMinutes(10);
        stopper2.addSeconds(10);
        // stopper2 - 10:10:10

        stopper1.addTime(stopper2);
        /* the test written the first time to make sure the addTime method works
        the second time i called addTime just to make sure i can test "stopper1" 
        well, because he was reseted after subTime */
        expect(stopper1.totalSeconds).toBe(stopper2.totalSeconds);

        stopper1.subTime(stopper2);
        expect(stopper1.totalSeconds).toBe(0);

        stopper1.addTime(stopper2);
        expect(stopper1.totalSeconds).toBe(stopper2.totalSeconds);

        stopper1.subSeconds(5);
        expect(stopper1.seconds).toBe(5);

        stopper1.subMinutes(9);
        expect(stopper1.minutes).toBe(1);

        stopper1.subHours(3);
        expect(stopper1.hours).toBe(7);

        stopper1.subHours(200);
        expect(stopper1.totalSeconds).toBe(Stopper.MIN_STOPPER_SECONDS);

        stopper1.hours = 11;
        expect(stopper1.hours).toBe(11);

        stopper1.minutes = 11;
        expect(stopper1.minutes).toBe(11);

        stopper1.seconds = 11;
        expect(stopper1.seconds).toBe(11);

        stopper1.subTime(stopper2);
        /* stopper1 - 11:11:11
        stopper2 is - 10:10:10
        11:11:11 - 10:10:10 = 01:01:01 (3661 totalSeconds) */
        expect(stopper1.totalSeconds).toBe(3661);

        stopper1.resetHours();
        expect(stopper1.hours).toBe(0);

        stopper1.resetMinutes();
        expect(stopper1.minutes).toBe(0);

        stopper1.resetSeconds();
        expect(stopper1.seconds).toBe(0);

        expect(stopper1.toString()).toBe('00:00:00');
    });

    describe('start & pause & stop & reset methods tests', () => {
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
            [50, '00:00:50'],
            [30, '00:00:30'],
            [3600, '01:00:00'],
            [0, '00:00:00'],
        ])(
            'stopper created, using start method, after %s seconds returns %s',
            (timeoutSeconds, result) => {
                const stopper = new Stopper();
                stopper.start();
                expect(stopper.toString()).toBe('00:00:00');

                setTimeout(() => {
                    expect(stopper.toString()).toBe(result);
                }, timeoutSeconds * 1000);
            }
        );

        test('stopper started, then using start method multiple times, this should not interrupt the initial interval started', () => {
            const stopper = new Stopper();
            expect(stopper.toString()).toBe('00:00:00');
            stopper.start();

            setTimeout(() => {
                stopper.start();
                expect(stopper.toString()).toBe('00:00:02');
                stopper.start();
            }, 2000);

            setTimeout(() => {
                expect(stopper.toString()).toBe('00:00:04');
                stopper.start();
            }, 4000);

            setTimeout(() => {
                stopper.start();
                expect(stopper.toString()).toBe('00:00:06');
            }, 6000);
        });

        test.each([
            [70, '00:01:10'],
            [10, '00:00:10'],
            [3600, '01:00:00'],
            [0, '00:00:00'],
        ])(
            'stopper created, autoStart set to true, after %s seconds returns %s',
            (timeoutSeconds, result) => {
                const stopper = new Stopper(true);
                expect(stopper.toString()).toBe('00:00:00');

                setTimeout(() => {
                    expect(stopper.toString()).toBe(result);
                }, timeoutSeconds * 1000);
            }
        );

        test('stopper created, autoStart set to false by default, after 200 seconds returns 00:00:00', () => {
            const stopper = new Stopper();
            expect(stopper.toString()).toBe('00:00:00');

            setTimeout(() => {
                expect(stopper.toString()).toBe('00:00:00');
            }, 70 * 1000);
        });

        test('stopper starts, after 5 seconds pause at "00:00:05", to make sure interval pause, after another 5 seconds check stopper', () => {
            const stopper = new Stopper();
            expect(stopper.toString()).toBe('00:00:00');
            stopper.start();

            setTimeout(() => {
                stopper.pause();
                expect(stopper.toString()).toBe('00:00:05');
            }, 5000);

            setTimeout(() => {
                expect(stopper.toString()).toBe('00:00:05');
            }, 5000 * 2);
        });

        test('stopper starts, after 5 seconds: "00:00:05" pause & start to make sure the pause is not changing the stopper', () => {
            const stopper = new Stopper(true);
            expect(stopper.toString()).toBe('00:00:00');

            setTimeout(() => {
                stopper.pause();
                stopper.start();
                expect(stopper.toString()).toBe('00:00:05');
            }, 5000);
        });

        test.each([[70], [10], [3600], [2]])(
            'stopper started counting, after %s seconds using reset method, waits for 5s, returns 00:00:05',
            (timeoutSeconds) => {
                const stopper = new Stopper();
                expect(stopper.toString()).toBe('00:00:00');
                stopper.start();

                setTimeout(() => {
                    stopper.reset();
                }, timeoutSeconds * 1000);

                setTimeout(() => {
                    // to make sure that reset method doesn't pause the interval
                    expect(stopper.toString()).toBe('00:00:02');
                }, 2000 + timeoutSeconds * 1000);
            }
        );

        test('stopper starts, stop after 5 seconds: "00:00:05", then to make sure it stopped stopper checked again after 5 seconds', () => {
            const stopper = new Stopper(true);
            expect(stopper.toString()).toBe('00:00:00');

            setTimeout(() => {
                stopper.stop();
                expect(stopper.toString()).toBe('00:00:05');
            }, 5000);

            setTimeout(() => {
                expect(stopper.toString()).toBe('00:00:05');
            }, 5000 * 2);
        });

        test('stopper starts, after 5 seconds: "00:00:05" stop & start to make sure the stop is reseting stopper at next start', () => {
            const stopper = new Stopper(true);
            expect(stopper.toString()).toBe('00:00:00');

            setTimeout(() => {
                stopper.stop();
                stopper.start();
                expect(stopper.toString()).toBe('00:00:00');
            }, 5000);
        });
    });

    test('invalid cases - inheritance of parameter validation', () => {
        const stopper = new Stopper();

        expect(() => {
            stopper.hours = [1, 2, 3];
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            stopper.minutes = 'string';
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            stopper.seconds = ['a', 'b', 'c'];
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            new Stopper('hulio123');
        }).toThrow(Error('Boolean element must be true or false'));

        expect(() => {
            new Stopper(999);
        }).toThrow(Error('Boolean element must be true or false'));

        expect(() => {
            new Stopper({ afek: 'sakaju' });
        }).toThrow(Error('Boolean element must be true or false'));

        expect(() => {
            new Stopper([{ 1: 2 }, { 10: 20 }]);
        }).toThrow(Error('Boolean element must be true or false'));
    });
});
