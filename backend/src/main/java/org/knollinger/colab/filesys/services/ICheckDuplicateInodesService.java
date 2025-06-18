package org.knollinger.colab.filesys.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;

/**
 * Der {@link ICheckDuplicateInodesService} dient zum test auf potentielle Namens-Konfikte
 * bei Upload, Copy und Move.
 * 
 * Er sollte also vor jeder dieser Operationen gerufen werden. Natürlich kann zwischen dem
 * Aufruf dieses Services und einer folgenden Upload/Copy/Move-Op noch ein Insert oder
 * rename durch einen anderen Benutzer statt finden, die Wahrscheinlichkeit ist aber eher
 * gering. Sollte dies trotzdem der Fall sein, so wird über DB-Constraints eine ungültige
 * Situation verhindert, ist halt nicht schön für den Benutzer.
 */
public interface ICheckDuplicateInodesService
{
    /**
     * Prüfe, ob es ein oder mehrere Konflikte mit den gelieferten Namen im Target-Folder geben könnte.
     * 
     * @param targetId
     * @param sourceNames
     * @return 
     * @throws TechnicalFileSysException 
     */
    public List<String> checkDuplicates(UUID targetId, List<String> inodes) throws TechnicalFileSysException;
}
