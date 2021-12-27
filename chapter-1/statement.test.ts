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
            let ret = null;
            try {
                ret = await targetFunc(...result[i]);
                expect(ret).toMatchSnapshot();
            } catch (e) {
                expect(e).toMatchSnapshot();
            }
        });
    }
}


describe('statement', () => {
    function performanceFooWithAudience(audience: number | null) {
        if (audience === null) {
            return {
                performances: [],
            };
        }

        return {
            performances: [{
                playID: 'foo',
                audience,
            }],
        }
    }

    function playFooWithType(playType: 'comedy' | 'tragedy') {
        return {
            foo: {
                name: 'Foo',
                type: playType,
            }
        }
    }

    verifyAllCombinationsSnapshot('statement safety net', (audience: number | null, type: string | null) => {
        const perfs = performanceFooWithAudience(audience)
        const plays = playFooWithType(type);
        return statement(perfs, plays);
    }, [
        null,
        10,
        100,
        20,
        21,
        29,
        31,
        30,
    ], [
        null,
        'comedy',
        'tragedy',
        'foo',
    ]);
});
