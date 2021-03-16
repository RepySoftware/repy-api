export enum PersonIcmsContributorType {
    CONTRIBUTOR = 'CONTRIBUTOR',
    EXEMPT = 'EXEMPT',
    NON_CONTRIBUTOR = 'NON_CONTRIBUTOR'
}

export function PersonIcmsContributorTypeToCode(type: PersonIcmsContributorType): string {

    if (type == PersonIcmsContributorType.CONTRIBUTOR) return '1';
    else if (type == PersonIcmsContributorType.EXEMPT) return '2';
    else if (type == PersonIcmsContributorType.NON_CONTRIBUTOR) return '9';
}