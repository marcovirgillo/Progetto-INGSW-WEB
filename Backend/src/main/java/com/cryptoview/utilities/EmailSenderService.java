package com.cryptoview.utilities;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailSenderService {
	
	public static final String REGISTRATION_MESSAGES = "Hi there! \n Welcome in Cryptoview!";
	private static final String PASSWORD_RESET_MSG = "Hi there!\nThis is your temporary password to access the account. You must change it"
													+ " after the first login\n\n";
	
	private static final String ACCOUNT_DELETION = "Hi there, your account has been deleted by our staff!\nFeel free to contact us to get more detail\n";
	
	@Autowired
	public EmailSenderService(JavaMailSender sender) {
		mailSender = sender;	
	}
	
	private static JavaMailSender mailSender;

	public static void sendEmail(String toEmail, String subject, String body) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("cryptoview3@gmail.com");
		message.setTo(toEmail);
		message.setSubject(subject);
		message.setText(body);

		mailSender.send(message);
		System.out.println("Mail sent!");
	}
	
	public static void sendPasswordResetEmail(String toEmail, String pwd) {
		sendEmail(toEmail, "Passord reset CryptoView Account", PASSWORD_RESET_MSG + pwd);
	}

	public static void sendAccountDeletedEmail(String email) {
		sendEmail(email, "CryptoView account deletion", ACCOUNT_DELETION);
		
	}
}
