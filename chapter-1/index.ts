import { statement } from './statement';

const invoices = require('./invoices.json');
const plays = require('./plays.json');

if (typeof require !== 'undefined' && require.main === module) {

    invoices.forEach((invoice: any) => {
        console.log(statement(invoice, plays));
    });
}
