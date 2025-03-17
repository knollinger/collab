export class Permissions {

    public static get READ(): number {
        return 0o4;
    }

    public static get WRITE(): number {
        return 0o2;
    }
    
    public static get DELETE(): number {
        return 0o1;
    }


    public static get USR_PERMS_MASK(): number {
        return 0o700;
    }
    
    public static get USR_PERMS_SHIFT(): number {
        return 6;
    }
    
    public static get GRP_PERMS_MASK(): number {
        return 0o70;
    }
    
    public static get GRP_PERMS_SHIFT(): number {
        return 3;
    }
    
    public static get WORLD_PERMS_MASK(): number {
        return 0o7;
    }

    public static get WORLD_PERMS_SHIFT(): number {
        return 0;
    }
}
