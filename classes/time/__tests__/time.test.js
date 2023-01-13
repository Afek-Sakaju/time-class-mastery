const Time = require('../time');

describe('Time class tests', () => {
    describe('valid cases', () => {
        describe('creation tests', () => {
            test.each([
                [{ seconds: 0, minutes: 0, hours: 101 }, '99:59:59'],
                [{ seconds: 0, minutes: 0, hours: 15 }, '15:00:00'],
                [{ seconds: 0, minutes: 0, hours: -50 }, '-50:00:00'],
                [{ seconds: 0, minutes: 0, hours: -100 }, '-99:59:59'],
            ])(
                'creating time with params: %s should returns time: %s',
                (params, result) => {
                    const time = new Time(params);
                    expect(time.toString()).toBe(result);
                }
            );

            test.each([
                [{ seconds: 0, minutes: 10000, hours: 0 }, '99:59:59'],
                [{ seconds: 0, minutes: 90, hours: 0 }, '01:30:00'],
                [{ seconds: 0, minutes: -90, hours: 0 }, '-01:30:00'],
                [{ seconds: 0, minutes: -10000, hours: 0 }, '-99:59:59'],
            ])(
                'creating time with params: %s should returns time: %s',
                (params, result) => {
                    const time = new Time(params);
                    expect(time.toString()).toBe(result);
                }
            );

            test.each([
                [{ seconds: 0, minutes: 0, hours: 0 }, '00:00:00'],
                [{ seconds: 70, minutes: 0, hours: 0 }, '00:01:10'],
                [{ seconds: -70, minutes: 0, hours: 0 }, '-00:01:10'],
                [{ seconds: -380000, minutes: 0, hours: 0 }, '-99:59:59'],
            ])(
                'creating time with params: %s should returns time: %s',
                (params, result) => {
                    const time = new Time(params);
                    expect(time.toString()).toBe(result);
                }
            );

            test.each([
                [{ seconds: 0, minutes: 0, hours: 0 }, '00:00:00'],
                [{ seconds: 10, minutes: 30, hours: 1 }, '01:30:10'],
                [{ seconds: 0, minutes: 10, hours: 3 }, '03:10:00'],
                [{ seconds: 50, minutes: 50, hours: 50 }, '50:50:50'],
            ])(
                'creating time with:%s units should returns time: %s',
                (params, result) => {
                    const time = new Time(params);
                    expect(time.toString()).toBe(result);
                }
            );

            test("creating time without params return's current time", () => {
                const time = new Time();
                const currentTime = new Date().toLocaleString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                expect(time.toString()).toBe(currentTime);
            });

            test("creating time with null params return's current time", () => {
                const time = new Time({
                    seconds: null,
                    minutes: null,
                    hours: null,
                });
                const currentTime = new Date().toLocaleString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                expect(time.toString()).toBe(currentTime);
            });
        });

        describe('get & set methods tests', () => {
            let time;

            beforeEach(() => {
                time = new Time({ seconds: 30, minutes: 10, hours: 5 });
                // '05:10:30'
            });

            test.each([
                [120, 99], // '99:59:59'
                [1, 1], // '01:10:30'
                [0, 0], // '00:10:30'
                [-30, -29], // '-29:49:30' - because initial time was positive
                [-120, -99], // '-99:59:59' - because initial time was positive
            ])(
                'initial time:"05:10:30" changed by set method with:%s hours, returns:%s hours with get method',
                (setHours, getHours) => {
                    time.hours = setHours;
                    expect(time.hours).toBe(getHours);
                }
            );

            test.each([
                [70, 10], // '06:10:30'
                [1, 1], // '05:01:30'
                [0, 0], // '05:00:30'
                [-1, 59], // '04:59:30' - because initial time was positive
                [-50, 10], // '04:10:30' - because initial time was positive
            ])(
                'initial time:"05:10:30" changed by set method with:%s minutes, returns:%s minutes with get method',
                (setMinutes, getMinutes) => {
                    time.minutes = setMinutes;
                    expect(time.minutes).toBe(getMinutes);
                }
            );

            test.each([
                [70, 10], // '05:11:10'
                [10, 10], // '05:10:10'
                [0, 0], // '05:10:00'
                [-10, 50], // '04:50:30'
                [-70, 50], // '03:50:30'
            ])(
                'initial time:"05:10:30" changed by set method with:%s seconds, returns:%s seconds with get method',
                (setSeconds, getSeconds) => {
                    time.seconds = setSeconds;
                    expect(time.seconds).toBe(getSeconds);
                }
            );
        });

        describe('add/sub param methods tests', () => {
            let time;

            beforeEach(() => {
                time = new Time({ seconds: 0, minutes: 30, hours: 15 }); // '15:30:00'
            });

            test.each([
                [130, '99:59:59'],
                [5, '20:30:00'],
                [0, '15:30:00'],
                [-5, '10:30:00'],
                [-130, '-99:59:59'],
            ])(
                'initial time:"15:30:00" changed by addHours method of:%s hours, the result is:%s',
                (hours, result) => {
                    time.addHours(hours);
                    expect(time.toString()).toBe(result);
                }
            );

            test.each([
                [10000, '99:59:59'],
                [20, '15:50:00'],
                [0, '15:30:00'],
                [-30, '15:00:00'],
                [-10000, '-99:59:59'],
            ])(
                'initial time:"15:30:00" changed by addMinutes method of:%s minutes, the result is:%s',
                (minutes, result) => {
                    time.addMinutes(minutes);
                    expect(time.toString()).toBe(result);
                }
            );

            test.each([
                [380000, '99:59:59'],
                [40, '15:30:40'],
                [0, '15:30:00'],
                [-30, '15:29:30'],
                [-480000, '-99:59:59'],
            ])(
                'initial time:"15:30:00" changed by addSeconds method of:%s seconds, the result is:%s',
                (seconds, result) => {
                    time.addSeconds(seconds);
                    expect(time.toString()).toBe(result);
                }
            );

            test.each([
                [-130, '99:59:59'],
                [-5, '20:30:00'],
                [0, '15:30:00'],
                [5, '10:30:00'],
                [130, '-99:59:59'],
            ])(
                'initial time:"15:30:00" changed by subHours method of:%s hours, the result is:%s',
                (hours, result) => {
                    time.subHours(hours);
                    expect(time.toString()).toBe(result);
                }
            );

            test.each([
                [-10000, '99:59:59'],
                [-20, '15:50:00'],
                [0, '15:30:00'],
                [30, '15:00:00'],
                [10000, '-99:59:59'],
            ])(
                'initial time:"15:30:00" changed by subMinutes method of:%s minutes, the result is:%s',
                (minutes, result) => {
                    time.subMinutes(minutes);
                    expect(time.toString()).toBe(result);
                }
            );

            test.each([
                [-380000, '99:59:59'],
                [-40, '15:30:40'],
                [0, '15:30:00'],
                [30, '15:29:30'],
                [480000, '-99:59:59'],
            ])(
                'initial time:"15:30:00" changed by subSeconds method of:%s seconds, the result is:%s',
                (seconds, result) => {
                    time.subSeconds(seconds);
                    expect(time.toString()).toBe(result);
                }
            );

            test.each([
                [{ seconds: 0, minutes: 0, hours: 0 }, '15:30:00'],
                [{ seconds: 30, minutes: 20, hours: 1 }, '16:50:30'],
                [{ seconds: 0, minutes: 0, hours: 100 }, '99:59:59'],
                [{ seconds: 0, minutes: -30, hours: -1 }, '14:00:00'],
                [{ seconds: 0, minutes: -30, hours: -15 }, '00:00:00'],
            ])(
                'time created with:%s added to initial time:"15:30:00", then results:%s',
                (params, result) => {
                    const time2 = new Time(params);
                    time.addTime(time2);
                    expect(time.toString()).toBe(result);
                }
            );

            test.each([
                [{ seconds: 0, minutes: 30, hours: 1 }, '14:00:00'],
                [{ seconds: 0, minutes: 30, hours: 15 }, '00:00:00'],
                [{ seconds: 0, minutes: 0, hours: 0 }, '15:30:00'],
                [{ seconds: -30, minutes: -20, hours: -1 }, '16:50:30'],
                [{ seconds: 0, minutes: 0, hours: -100 }, '99:59:59'],
            ])(
                'time created with:%s subbed from initial time:"15:30:00", then results:%s',
                (params, result) => {
                    const time2 = new Time(params);
                    time.subTime(time2);
                    expect(time.toString()).toBe(result);
                }
            );
        });
        describe('reset & toString methods tests', () => {
            let time1;
            let time2;

            beforeEach(() => {
                time1 = new Time({ seconds: 30, minutes: 25, hours: 20 }); // '20:25:30'
                time2 = new Time({ seconds: -30, minutes: -25, hours: -20 }); // '-20:25:30'
            });

            test('resetHours applied on time:"20:25:30", returns time: "00:25:30"', () => {
                time1.resetHours();
                expect(time1.toString()).toBe('00:25:30');
            });

            test('resetHours applied on time:"-20:25:30", returns time: "-00:25:30"', () => {
                time2.resetHours();
                expect(time2.toString()).toBe('-00:25:30');
            });

            test('resetMinutes applied on time:"20:25:30", returns time: "20:00:30"', () => {
                time1.resetMinutes();
                expect(time1.toString()).toBe('20:00:30');
            });

            test('resetMinutes applied on time:"-20:25:30", returns time: "-20:00:30"', () => {
                time2.resetMinutes();
                expect(time2.toString()).toBe('-20:00:30');
            });

            test('resetSeconds applied on time:"20:25:30", returns time: "20:25:00"', () => {
                time1.resetSeconds();
                expect(time1.toString()).toBe('20:25:00');
            });

            test('resetSeconds applied on time:"-20:25:30", returns time: "-20:25:00"', () => {
                time2.resetSeconds();
                expect(time2.toString()).toBe('-20:25:00');
            });

            test('reset applied on time:"20:25:30", returns time: "00:00:00"', () => {
                time1.reset();
                expect(time1.toString()).toBe('00:00:00');
            });

            test('reset applied on time:"-20:25:30", returns time: "00:00:00"', () => {
                time2.reset();
                expect(time2.toString()).toBe('00:00:00');
            });

            test.each([
                ['HHhours:MMminutes:SSseconds', '20hours:25minutes:30seconds'],
                ['HHh:MMm:SSs', '20h:25m:30s'],
                ['HHhrs', '20hrs'],
                ['MMmins', '25mins'],
                ['SSseconds', '30seconds'],
                [undefined, '20:25:30'],
            ])(
                'calling toString with format:%s on time:"20:25:30" expect output:%s',
                (format, res) => {
                    expect(time1.toString(format)).toBe(res);
                }
            );

            test.each([
                ['HHhours:MMminutes:SSseconds', '-20hours:25minutes:30seconds'],
                ['HHh:MMm:SSs', '-20h:25m:30s'],
                ['HHhrs', '-20hrs'],
                ['MMmins', '-25mins'],
                ['SSseconds', '-30seconds'],
                [undefined, '-20:25:30'],
            ])(
                'calling toString with format:%s on time:"-20:25:30" expect output:%s',
                (format, res) => {
                    expect(time2.toString(format)).toBe(res);
                }
            );
        });
    });

    describe('invalid cases', () => {
        let time;

        beforeAll(() => {
            time = new Time({ seconds: 20, minutes: 15, hours: 10 });
        });

        test.each([
            [{ seconds: 'bob', minutes: 'bob', hours: 'bob' }],
            [{ seconds: '', minutes: 15, hours: 15 }],
            [{ seconds: 15, minutes: '', hours: 15 }],
            [{ seconds: 15, minutes: 15, hours: '' }],
            [{ seconds: 10, minutes: [20], hours: [30] }],
            [{ seconds: 0, minutes: { a: 1 }, hours: { a: 2 } }],
        ])('creation of time with invalid params', (params) => {
            expect(() => {
                new Time(params);
            }).toThrow(Error('Time element must be a valid number'));
        });

        test.each([
            [undefined],
            ['abc'],
            [() => {}],
            ['10'],
            [[]],
            [[5]],
            [{}],
            [{ 5: 5 }],
            [null],
        ])('set method with invalid param returns error', (param) => {
            expect(() => {
                time.hours = param;
            }).toThrow(Error('Time element must be a valid number'));

            expect(() => {
                time.seconds = param;
            }).toThrow(Error('Time element must be a valid number'));

            expect(() => {
                time.minutes = param;
            }).toThrow(Error('Time element must be a valid number'));
        });
    });
});
