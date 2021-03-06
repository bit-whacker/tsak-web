package org.projectspinoza.twitterswissarmyknife.command;

import java.io.BufferedWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.projectspinoza.twitterswissarmyknife.util.TsakResponse;

import twitter4j.PagableResponseList;
import twitter4j.ResponseList;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.User;

import com.beust.jcommander.Parameter;
import com.beust.jcommander.Parameters;
import com.google.gson.Gson;

@Parameters(commandNames = "dumpMutesList", commandDescription = "Authenticated user's muted lists")
public class CommandDumpMutesList extends BaseCommand {
    @Parameter(names = "-limit", description = "Authenticated user api calls limit")
    private int limit = 1;

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    @Override
    public TsakResponse execute(Twitter twitter) throws TwitterException {
        List<PagableResponseList<User>> mutesList = new ArrayList<PagableResponseList<User>>();
        int userLimit = this.limit;
        int remApiLimits = 0;
        long cursor = -1;
        do {
            PagableResponseList<User> users = twitter.getMutesList(cursor);
            mutesList.add(users);
            cursor = users.getNextCursor();
            remApiLimits = users.getRateLimitStatus().getRemaining();
        } while ((cursor != 0) && (remApiLimits != 0) && (--userLimit > 0));
        TsakResponse tsakResponse = new TsakResponse(remApiLimits, mutesList);
        tsakResponse.setCommandDetails(this.toString());
        return tsakResponse;
    }

    @SuppressWarnings("unchecked")
    @Override
    public void write(TsakResponse tsakResponse, BufferedWriter writer) throws IOException {
        List<PagableResponseList<User>> mutesList = (List<PagableResponseList<User>>) tsakResponse.getResponseData();
        for (ResponseList<User> users : mutesList) {
            for (User user : users) {
                String userJson = new Gson().toJson(user);
                writer.append(userJson);
                writer.newLine();
            }
        }
    }

    @Override
    public String toString() {
        return "CommandDumpMutesList [limit=" + limit + "]";
    }
}