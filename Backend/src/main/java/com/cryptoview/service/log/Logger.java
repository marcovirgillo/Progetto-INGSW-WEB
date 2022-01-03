package com.cryptoview.service.log;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class Logger {
	
	private static Logger instance = null;
	private FileWriter myWriter;
	
	private Logger() throws IOException {
		File log = new File("ServerLog.txt");
	    if (log.createNewFile()) {
	    	System.out.println("[SERVER] File created: " + log.getName());
	    } else {
	    	System.out.println("[SERVER] File log already exists.");
	    }
	    myWriter = new FileWriter("ServerLog.txt", true);
	}
	
	public static Logger getInstance() throws IOException {
		if(instance == null)
			instance = new Logger();
		return instance;
	}
	
	public synchronized void addEvent(String event) {
		try {
		      myWriter.append(java.time.LocalDateTime.now() + " " + event + System.lineSeparator());
		      myWriter.flush();
		} catch (IOException e) {
		      e.printStackTrace();
		}
	}
}
