package org.knollinger.colab.filesys.models;

/**
 * Definiert die Konstanten zur Verarbeitung von Permissions
 * 
 * Die Permissions sind in drei Gruppen (Benutzer, Gruppe, Welt) organisiert. 
 * Als BitMuster sieht das so aus:
 * <pre>
 * &lt;User&gt&ltGroup&gt;&lt;World&gt;
 * </pre>
 * 
 * Jede Gruppe besteht aus drei Bits in folgender Anordnung:
 * <pre>
 * &lt;Read&gt&ltWrite&gt;&lt;Delete&gt;
 * </pre>
 * 
 * Im gegensatz zu Unix-typischen Permissions existiert kein Execute-Flag, das 
 * macht hier keinen Sinn. Statt dessen wird das implizite Delete via Write-
 * Permission auf den Parent durch ein eigenes Flag an der INode gelöst.
 */
public interface IPermissions
{
    public static final short READ = 04;
    public static final short WRITE = 02;
    public static final short DELETE = 01;
    public static final short ALL_PERMS = READ | WRITE | DELETE;

    public static final short USR_PERMS_MASK = 0700;
    public static final short USR_PERMS_SHIFT = 6;
    public static final short GRP_PERMS_MASK = 070;
    public static final short GRP_PERMS_SHIFT = 3;
    public static final short WORLD_PERMS_MASK = 07;
    public static final short WORLD_PERMS_SHIFT = 0;

    public static final short USR_READ = READ << USR_PERMS_SHIFT;
    public static final short USR_WRITE = WRITE << USR_PERMS_SHIFT;
    public static final short USR_DELETE = DELETE << USR_PERMS_SHIFT;

    public static final short GRP_READ = READ << GRP_PERMS_SHIFT;
    public static final short GRP_WRITE = WRITE << GRP_PERMS_SHIFT;
    public static final short GRP_DELETE = DELETE << GRP_PERMS_SHIFT;

    public static final short WORLD_READ = READ << WORLD_PERMS_SHIFT;
    public static final short WORLD_WRITE = WRITE << WORLD_PERMS_SHIFT;
    public static final short WORLD_DELETE = DELETE << WORLD_PERMS_SHIFT;
}
