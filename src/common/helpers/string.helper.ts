export abstract class StringHelper {

    public static toCpfCnpj(value: string): string {

        if (value.length == 11) {
            // cpf
            return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
        }
        else if (value.length == 14) {
            // cnpj
            return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
        } else {
            // throw new Error(`${value} is not a CPF or CNPJ`);
            return value;
        }
    };

    public static getOnlyNumbers(value: string): string {
        return value.replace(/[^0-9\\.]+/g, '');
    }
}