interface Play {
    readonly name: string;
    readonly type: 'tragedy' | 'comedy';
}

interface Performance {
    readonly playID: string;
    readonly audience: number;
}

interface Invoice {
    readonly customer: string;

    readonly performances: Performance[];
}

interface PerformanceReport {
    readonly playName: string;

    readonly amount: number;

    readonly audience: number;

    readonly credits: number;
}

interface CustomerStatement {
    readonly customer: string;

    readonly amount: number;

    readonly credits: number;

    readonly performances: PerformanceReport[];
}

export function statement(invoice: Invoice, plays:  {[key: string]: Play}) {
    const customerStatement = genStatement(invoice, plays);

    return genTextReport(customerStatement);
}

function getAmount(playType: 'tragedy' | 'comedy', audience: number) {
    let amount = 0;

    switch (playType) {
        case 'tragedy':
            amount = 40000;

            if (audience > 30) {
                amount += 1000 * (audience - 30);
            }
        break;

        case 'comedy':
            amount = 30000;

            if (audience > 20) {
                amount += 10000 + 500 * (audience - 20);
            }

            amount += 300 * audience;
        break;
        default:
            throw new Error(`unknown type: ${playType}`);
    }

    return amount;
}

function getCredit(playType: 'tragedy' | 'comedy', audience: number) {
    let credits = Math.max(audience - 30, 0);
    // add extra credit for every then comedy attendees
    if ('comedy' === playType) {
        credits = credits + Math.floor(audience / 5);
    }

    return credits;
}

function getTotalCredit(reports: PerformanceReport[]) {
    let totalCredits = 0;
    for (let perfReport of reports) {
        totalCredits = totalCredits + perfReport.credits;
    }
    return totalCredits;
}

function getTotalAmount(reports: PerformanceReport[]) {
    let totalAmount = 0;
    for (let perfReport of reports) {
        totalAmount = totalAmount + perfReport.amount;
    }
    return totalAmount;
}

function getPerformanceReports(performances: Performance[], plays: {[key: string]: Play}) {
    return performances.map(perf => {
        const play = plays[perf.playID];
        return getPerformanceReport(perf, play);
    });
}

function getPerformanceReport(perf: Performance, play: Play) {
    const credits = getCredit(play.type, perf.audience);
    const amount = getAmount(play.type, perf.audience);

    return {
        playName: play.name,
        amount: amount,
        credits: credits,
        audience: perf.audience,
    };
}

function currency(num: number) {
    const format = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format;

    return format(num/100);
}

function genStatement(invoice: Invoice, plays: {[key: string]: Play}): CustomerStatement {
    const perfReports: PerformanceReport[] = getPerformanceReports(invoice.performances, plays);

    return {
        customer: invoice.customer,
        amount: getTotalAmount(perfReports),
        credits: getTotalCredit(perfReports),
        performances: perfReports,
    };
}

function genTextReport(customerStatement: CustomerStatement) {
    let result = `Statement for ${customerStatement.customer}\n`;
    for (const perfReport of customerStatement.performances) {
        result += ` ${perfReport.playName}: ${currency(perfReport.amount)} (${perfReport.audience} seats)\n`;
    }

    result += `Amount owed is ${currency(customerStatement.amount)}\n`;
    result += `You earned ${customerStatement.credits} credits\n`;
    return result;
}
