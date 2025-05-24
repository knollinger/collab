package org.knollinger.workingtogether.wopi.services.impl;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.knollinger.workingtogether.wopi.exceptions.TechnicalWOPIException;
import org.knollinger.workingtogether.wopi.services.IWOPIDiscoveryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * 
 */
@Service
public class WOPIDiscoryService implements IWOPIDiscoveryService
{
    private static final String APP_XPATH = "//wopi-discovery/net-zone/app";
    private static final String ACTION_XPATH = "//action";
    private static final Pattern MIMETYPE_PATTERN = Pattern.compile(".*\\/.*");
    private static final String ERR_LOAD_MIMETYPES = "Die Liste der Datei-Typen konnte nicht geladen werden da der Collabara-Dienst nicht erreichbar ist.";
    @Value("${collabara.discoveryUrl}")
    private URL discoveryUrl;

    @Value("${collabara.capsUrl}")
    private URL capsUrl;

    @Override
    public Map<String, Map<String, String>> discoverWOPI() throws TechnicalWOPIException
    {
        try
        {
            Map<String, Map<String, String>> result = new HashMap<>();
            Document doc = this.loadDiscoveryDoc();
            
            List<Element> mimeTypeDescs = this.getMimeTypeDescriptors(doc);

            for (Element elem : mimeTypeDescs)
            {
                String mimeType = elem.getAttribute("name");
                Map<String, String> actions = this.getActions(elem);
                result.put(mimeType, actions);
            }
            return result;
        }
        catch (SAXException | ParserConfigurationException | IOException | XPathExpressionException e)
        {
            throw new TechnicalWOPIException(ERR_LOAD_MIMETYPES, e);
        }
    }

    /**
     * 
     * @param elem
     * @return
     * @throws XPathExpressionException 
     */
    private Map<String, String> getActions(Element elem) throws XPathExpressionException
    {
        Map<String, String> result = new HashMap<>();
        XPath xPath = XPathFactory.newInstance().newXPath();
        NodeList nodes = (NodeList) xPath.evaluate(ACTION_XPATH, elem, XPathConstants.NODESET);
        for (int i = 0; i < nodes.getLength(); ++i)
        {
            Element action = (Element) nodes.item(i);
            String name = action.getAttribute("name");
            String url  = action.getAttribute("urlsrc");
            result.put(name, url);
        }
        return result;
    }

    /**
     * Lade das Discovery-Dokument vom Collbra-Host
     *
     * @return
     * @throws ParserConfigurationException
     * @throws SAXException
     * @throws IOException
     */
    private Document loadDiscoveryDoc() throws ParserConfigurationException, SAXException, IOException
    {
        try (InputStream in = this.discoveryUrl.openConnection().getInputStream())
        {
            DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = builderFactory.newDocumentBuilder();
            return docBuilder.parse(in);
        }
    }

    /**
     * liefere alle Elemente aus dem Document welche via MimeType Actions beschreiben.
     * Alle vergügbaren APP-Bindings sind al &lt;app&gt;-Tags unter //wopi-discovery/net-zone
     * zu finden. Hier existieren zwei verschiedene App-Typen:
     * 
     * <ul>
     * <li>Das "name"-Attribut referenziert auf einen ApplicationName wie "writer", "impress", "draw", ...
     * <li>Das "name"-Attribut referenziert einen MimeType
     * </ul>
     * 
     * Auch wenn die "nicht-mimetype-tags" hübsche Infos wie zum Beispiel das FavIcon beinhalten, jucken
     * sie hier nicht. Wir wollen nur die MimeType-Referenzen.
     * 
     * Jedes dieser MimeType-Elemente kann 1-n &lt;action&gt;-Elemente mit folgendem Aufbau beinhalten:
     * <p>
     * <code>
     * &lt;action default="true" ext="" name="edit" urlsrc="http://localhost:9980/browser/ded56d8ff7/cool.html?"/&gt;
     * </code>
     * </p>
     * Und exakt die Liste mit den MimeType-Referenzen liefern wir hier zurück.
     * 
     * @throws XPathExpressionException wenn der XPath scheiße war....sollte aber nicht passieren.
     */
    private List<Element> getMimeTypeDescriptors(Document doc) throws XPathExpressionException
    {
        List<Element> result = new ArrayList<>();

        XPath xPath = XPathFactory.newInstance().newXPath();
        NodeList nodes = (NodeList) xPath.evaluate(APP_XPATH, doc, XPathConstants.NODESET);
        for (int i = 0; i < nodes.getLength(); ++i)
        {
            Element child = (Element) nodes.item(i);
            String name = child.getAttribute("name");
            if (MIMETYPE_PATTERN.matcher(name).matches())
            {
                result.add(child);
            }
        }
        return result;

    }
}
