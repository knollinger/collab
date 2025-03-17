package org.knollinger.workingtogether.filesys.models;

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
    public static final int READ = 04;
    public static final int WRITE = 02;
    public static final int DELETE = 01;
    
    public static final int USR_PERMS_MASK = 0700;
    public static final int USR_PERMS_SHIFT = 6;
    public static final int GRP_PERMS_MASK = 070;
    public static final int GRP_PERMS_SHIFT = 3;
    public static final int WORLD_PERMS_MASK = 07;
    public static final int WORLD_PERMS_SHIFT = 0;
}
