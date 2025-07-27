package org.knollinger.colab.calendar.services.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.dmfs.rfc5545.DateTime;
import org.dmfs.rfc5545.RecurrenceSet;
import org.dmfs.rfc5545.optional.LastInstance;
import org.dmfs.rfc5545.recur.InvalidRecurrenceRuleException;
import org.dmfs.rfc5545.recur.RecurrenceRule;
import org.dmfs.rfc5545.recurrenceset.OfRule;
import org.dmfs.rfc5545.recurrenceset.Within;
import org.knollinger.colab.calendar.models.CalendarEventCore;

/**
 * 
 */
class RecurringRuleParser
{
    /**
     * 
     * @param start
     * @param end
     * @return
     * @throws ParseException 
     * @throws InvalidRecurrenceRuleException 
     * @throws IOException 
     */
    public List<CalendarEventCore> eventsBetween(CalendarEventCore baseEvent, Date start, Date end)
        throws IOException, InvalidRecurrenceRuleException, ParseException
    {
        long duration = baseEvent.getEnd() - baseEvent.getStart();

        List<CalendarEventCore> result = new ArrayList<>();

        RecurrenceSet recurrences = this.compileRuleset(baseEvent.getRruleset());
        RecurrenceSet between = new Within(//
            new DateTime(start.getTime()), //
            new DateTime(end.getTime()), //
            recurrences);

        for (DateTime dateTime : between)
        {
            CalendarEventCore instance = CalendarEventCore.builder() //
                .uuid(baseEvent.getUuid()) //
                .owner(baseEvent.getOwner()) //
                .title(baseEvent.getTitle()) //
                .desc(baseEvent.getDesc()) //
                .fullDay(baseEvent.isFullDay()) //
                .rruleset(baseEvent.getRruleset()) //
                .start(dateTime.getTimestamp()) //
                .end(dateTime.getTimestamp() + duration) //
                .build();

            result.add(instance);
        }

        return result;
    }

    /**
     * 
     * @param baseEvent
     * @return
     * @throws IOException
     * @throws InvalidRecurrenceRuleException
     * @throws ParseException
     */
    public Date lastEvent(CalendarEventCore baseEvent) throws IOException, InvalidRecurrenceRuleException, ParseException
    {

        RecurrenceSet recurrences = this.compileRuleset(baseEvent.getRruleset());
        LastInstance last = new LastInstance(recurrences);
        return last.isPresent() ? new Date(last.value().getTimestamp()) : new Date(Long.MAX_VALUE);
    }

    /**
     * @param ruleSet
     * @return 
     * @return
     * @throws IOException
     * @throws InvalidRecurrenceRuleException 
     * @throws ParseException 
     */
    private RecurrenceSet compileRuleset(String ruleSet)
        throws IOException, InvalidRecurrenceRuleException, ParseException
    {
        DateTime dtStart = new DateTime(System.currentTimeMillis());
        String rrule = "";
        List<String> rDates = new ArrayList<>();
        String exRule = "";
        List<String> exDates = new ArrayList<>();

        BufferedReader reader = new BufferedReader(new StringReader(ruleSet));
        String rawLine = reader.readLine();
        while (rawLine != null)
        {
            RulesetLine ruleLine = new RulesetLine(rawLine);
            switch (ruleLine.getType())
            {
                case "DTSTART" :
                    dtStart = this.parseDateTime(ruleLine.getValue());
                    break;

                case "RRULE" :
                    rrule = ruleLine.getValue();
                    break;

                case "RDATE" :
                    rDates.add(ruleLine.getValue());
                    break;

                case "EXRULE" :
                    exRule = ruleLine.getValue();
                    break;

                case "EXDATE" :
                    exDates.add(ruleLine.getValue());
                    break;

                default :
                    break;
            }
            rawLine = reader.readLine();
        }

//        TimeZone timezone = TimeZone.getTimeZone("UTC");
        //        RecurrenceSet occurrences = new Difference(
        //            new Merged(new OfRule(new RecurrenceRule(rrule), dtStart), new OfList(timezone, rDates)),
        //            new Merged(new OfRule(new RecurrenceRule(exRule), dtStart), new OfList(timezone, exDates)));
        RecurrenceSet occurrences = new OfRule(new RecurrenceRule(rrule), dtStart);
        return occurrences;
    }

    /**
     * @param value
     * @return
     * @throws ParseException 
     */
    private DateTime parseDateTime(String value) throws ParseException
    {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'");
        LocalDateTime localDateTime = LocalDateTime.parse(value, formatter);

        ZoneId zone = ZoneId.of("UTC");
        Date date = Date.from(localDateTime.atZone(zone).toInstant());
        return new DateTime(date.getTime());
    }

    /**
     * Hilfsklasse um eine Zeile des RuleSets zu parsen. Es wird einfach das durch ':' 
     * getrennte KeyValue-Paar geparsed und die Werte gerimmed und uppercase geliefert.
     */
    private static class RulesetLine
    {
        private String type;
        private String value;

        /**
         * @param line
         */
        public RulesetLine(String line)
        {
            String[] parts = line.split(":");
            this.type = parts[0].trim().toUpperCase();
            this.value = parts[1].trim().toUpperCase();
        }

        /**
         * @return
         */
        public String getType()
        {
            return this.type;
        }

        /**
         * @return
         */
        public String getValue()
        {
            return this.value;
        }
    }
}
