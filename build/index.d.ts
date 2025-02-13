import { Compiler } from 'webpack';
interface Config {
    filter?(fileName: string): boolean;
}
export default class Plugin {
    static addStyle(html: string, style: string): string;
    private config;
    private css;
    private html;
    constructor(config?: Config);
    private filter;
    private prepare;
    private process;
    apply(compiler: Compiler): void;
}
export {};
