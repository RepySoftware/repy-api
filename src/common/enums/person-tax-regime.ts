export enum PersonTaxRegime {
    UNDEFINED = 'UNDEFINED',
    NATIONAL_SIMPLE = 'NATIONAL_SIMPLE',
    NATIONAL_SIMPLE_EXCESS_GROSS_REVENUE_SUB_LIMIT = 'NATIONAL_SIMPLE_EXCESS_GROSS_REVENUE_SUB_LIMIT',
    NORMAL = 'NORMAL'
}

export function PersonTaxRegimeToCode(regime: PersonTaxRegime): string {

    if (regime == PersonTaxRegime.UNDEFINED) return '0';
    else if (regime == PersonTaxRegime.NATIONAL_SIMPLE) return '1';
    else if (regime == PersonTaxRegime.NATIONAL_SIMPLE_EXCESS_GROSS_REVENUE_SUB_LIMIT) return '2';
    else if (regime == PersonTaxRegime.NORMAL) return '3';
}