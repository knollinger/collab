package org.knollinger.colab.journal.services;

import java.sql.Connection;

public interface IWriteJournalService
{
    /**
     * schreibt einen Journal-Eintrag. 
     * @param logId
     * @param args
     */
    public void writeJournal(Enum<?> logId, Object... args);

    /**
     * schreibt einen Journal-Eintrag im Context einer bestehenden
     * Datenbank-Transaktion.
     * 
     * Dies ist die preferierte Methode, da hier die lesenden/schreibenden
     * Zugriffe und der Journal-Eintrag atomar erfolgen.
     * 
     * @param logId
     * @param args
     */
    public void writeJournal(Connection conn, Enum<?> logId, Object... args);
}
