import { statement } from './statement';

function verifyAllCombinationsSnapshot(testName: string, targetFunc, ...argsList: any[][]) {
    const result: any[][] = [];
    const max = argsList.length - 1;

    function helper(arr: any[][], i: number) {
        for (let j = 0, l = argsList[i].length; j < l; j++) {
            const a = arr.slice(0);
            a.push(argsList[i][j]);
            if (i === max)
                result.push(a);
            else
                helper(a, i+1);
        }
    }

    helper([], 0);

    for(let i = 0; i < result.length; i++) {
        test(testName + ': ' + JSON.stringify(result[i]), async () => {
            const ret = await targetFunc(...result[i]);
            expect(ret).toMatchSnapshot();
        });
    }
}


describe('statement', () => {
    verifyAllCombinationsSnapshot('statement safety net', statement, [{
        performances: [],
    }, {
        performances: [{
            playID: 'foo',
            audience: 10,
        }],
    }, {
        performances: [{
            playID: 'foo',
            audience: 10,
        }],
    }, {
        performances: [{
            playID: 'foo',
            audience: 100,
        }],
    }, {
        performances: [{
            playID: 'foo',
            audience: 20,
        }],
    }, {
        performances: [{
            playID: 'foo',
            audience: 21,
        }],
    }, {
        performances: [{
            playID: 'foo',
            audience: 29,
        }],
    }, {
        performances: [{
            playID: 'foo',
            audience: 31,
        }],
    }, {
        performances: [{
            playID: 'foo',
            audience: 30,
        }],
    }], [
        {
            foo: {
                name: 'Foo',
                type: 'comedy',
            }
        }, {
            foo: {
                name: 'Foo',
                type: 'tragedy',
            }
        }
    ]);

    test('should throw exception if type is unexpected', () => {
        expect(() => {
            statement({
                performances: [{
                    playID: 'foo',
                    audience: 30,
                }],
            }, {
                foo: {
                    name: 'Foo',
                    type: 'foo',
                }
            });
        }).toThrowErrorMatchingSnapshot();
    });
});
