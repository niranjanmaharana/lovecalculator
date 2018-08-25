package com.niranjan.lovecalculator.mail;

import java.io.File;
import java.io.FileInputStream;
import java.util.Hashtable;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.imageio.ImageIO;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

public class MailSender {
	public static final Logger LOGGER = Logger.getLogger(MailSender.class);

	public MailSender() {}

	public boolean sendMail(JavaMailSender mailSender, String recipientAddress, String subject, String content, String type) {
		LOGGER.info("javaMailSender : " + mailSender);
		SimpleMailMessage email = new SimpleMailMessage();
		email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText(content);
        mailSender.send(email);
        return true;
	}

	public boolean sendMail(String fromEmailId, String emailpwd, String toEmailId, String auth, String portno,
			String hostname, String subject, String content, String type, String logopath, byte[] image,
			String rxplayBtnpath, byte[] orglogo, String bcc) {
		return sendMail(fromEmailId, emailpwd, toEmailId, auth, portno, hostname, subject, content, type, logopath,
				image, rxplayBtnpath, orglogo, bcc, null);
	}

	public boolean sendMail(String fromEmailId, String emailpwd, String toEmailId, String auth, String portno,
			String hostname, String subject, String content, String type, String logopath, byte[] image,
			String rxplayBtnpath, byte[] orglogo, String bcc, File[] list) {
		LOGGER.info("fromEmailId" + fromEmailId);
		boolean issent = false;
		File folder = new File(logopath);
		File file = null;
		byte[] mergedImage = null;
		File[] listOfFiles = (list == null && null != folder) ? folder.listFiles() : list != null ? list : null;
		Hashtable<String, String> fileNamepairs = new Hashtable<String, String>();
		Properties props = getMailProps(hostname, portno, auth);
		props.put("fromemailid", fromEmailId);
		props.put("emailpwd", emailpwd);
		Session session = buildSession(props);
		try {
			MimeMessage message = new MimeMessage(session);
			message.setFrom(new InternetAddress(fromEmailId));
			addRecipients(toEmailId, message);
			if (StringUtils.isNotBlank(bcc))
				addRecipientsBCC(bcc, message);
			addSubject(subject, message);
			addBody(content, message);
			if (type.equals("html")) {
				message.setContent(content, "text/html; charset=ISO-8859-1");
				MimeMultipart multipart = new MimeMultipart("related");
				BodyPart messageBodyPart = new MimeBodyPart();
				messageBodyPart.setContent(content, "text/html");
				if (listOfFiles != null && listOfFiles.length != 0) {
					for (int i = 0; i < listOfFiles.length; i++) {
						String ext = FilenameUtils.getExtension(listOfFiles[i].getName());
						if (!StringUtils.equals(ext, "html") && ImageIO.read(listOfFiles[i]) != null
								&& fileNamepairs.get(listOfFiles[i].getName()) == null) {

							byte[] logo = IOUtils.toByteArray(new FileInputStream(listOfFiles[i]));
							int index = listOfFiles[i].getName().lastIndexOf('.');
							String name = index != -1
									? listOfFiles[i].getName().substring(0, listOfFiles[i].getName().lastIndexOf('.'))
									: "test";

							if (logo != null && content.indexOf("\"cid:" + name + "\"") != -1
									&& !StringUtils.equals(name, "image")) {
								multipart.addBodyPart(messageBodyPart);
								messageBodyPart = new MimeBodyPart();

								if (!(StringUtils.equals(name, "clientlogo") || StringUtils.equals(name, "logo2"))) {
									DataSource fds = new ByteArrayDataSource(logo, "image/jpg");
									messageBodyPart.setDataHandler(new DataHandler(fds));
									messageBodyPart.addHeader("Content-ID", "<" + name + ">");
								} else {
									DataSource fds = new ByteArrayDataSource(orglogo != null ? orglogo : logo,
											"image/jpg");
									messageBodyPart.setDataHandler(new DataHandler(fds));
									messageBodyPart.addHeader("Content-ID", "<" + name + ">");
								}

								if (fileNamepairs.get(listOfFiles[i].getName()) == null)
									messageBodyPart.setFileName(listOfFiles[i].getName());
								messageBodyPart.setDisposition(MimeBodyPart.INLINE);
								multipart.addBodyPart(messageBodyPart);
							}
							fileNamepairs.put(listOfFiles[i].getName(), listOfFiles[i].getName());
						}
					}
				}
				if (image != null) {
					if (rxplayBtnpath != null && mergedImage == null) {
						file = new File(rxplayBtnpath);
						mergedImage = MergeFiles.merge(image, file);
						if (mergedImage != null)
							image = mergedImage;
					}
					multipart.addBodyPart(messageBodyPart);
					messageBodyPart = new MimeBodyPart();
					DataSource fds = new ByteArrayDataSource(image, "image/jpg");
					messageBodyPart.setDataHandler(new DataHandler(fds));
					if (content.indexOf("\"cid:image\"") != -1)
						messageBodyPart.addHeader("Content-ID", "<image>");
					else
						messageBodyPart.addHeader("Content-ID", "<video>");
					multipart.addBodyPart(messageBodyPart);
					messageBodyPart.setFileName("play.png");
					message.setContent(multipart);
				} else if (rxplayBtnpath != null) {
					file = new File(rxplayBtnpath);
					if (file != null) {
						byte playBtn[] = IOUtils.toByteArray(new FileInputStream(file));
						if (playBtn != null) {
							multipart.addBodyPart(messageBodyPart);
							messageBodyPart = new MimeBodyPart();
							DataSource fds = new ByteArrayDataSource(playBtn, "image/jpg");
							messageBodyPart.setDataHandler(new DataHandler(fds));
							if (content.indexOf("\"cid:image\"") != -1)
								messageBodyPart.addHeader("Content-ID", "<image>");
							else
								messageBodyPart.addHeader("Content-ID", "<video>");
							messageBodyPart.setFileName("play.png");
							multipart.addBodyPart(messageBodyPart);
							message.setContent(multipart);
						}
					}
				} else {
					if (listOfFiles != null && listOfFiles.length != 0) {
						message.setContent(multipart);
					} else {
						message.setContent(content, "text/html; charset=ISO-8859-1");
					}

				}
			}
			send(message);
			LOGGER.info("Mail sent to " + toEmailId);
			issent = true;
		} catch (MessagingException exception) {
			issent = false;
			LOGGER.error("Email Sending is Failed : " + exception.getMessage());
		} catch (Exception exception) {
			issent = false;
			LOGGER.error("Email Sending is Failed : " + exception.getMessage());
		}
		return issent;
	}

	public boolean sendMail(String fromEmailId, String emailpwd, String toEmailId, String auth, String portno,
			String hostname, String subject, String content, String type, String logopath, byte[] image,
			String rxplayBtnpath, byte[] orglogo) {
		return sendMail(fromEmailId, emailpwd, toEmailId, auth, portno, hostname, subject, content, type, logopath,
				image, rxplayBtnpath, orglogo, null);
	}

	public void send(MimeMessage message) throws MessagingException {
		Transport.send(message);
	}

	public void addBody(String content, MimeMessage message) throws MessagingException {
		Multipart multipart = new MimeMultipart();
		BodyPart messagePart = new MimeBodyPart();
		messagePart.setText(content);
		multipart.addBodyPart(messagePart);
		message.setContent(multipart);
	}

	public void addSubject(String subject, MimeMessage message) throws MessagingException {
		message.setSubject(subject);
	}

	public void addRecipients(String toEmailId, MimeMessage message) throws MessagingException, AddressException {
		message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmailId));
		// message.setRecipients(Message.RecipientType.BCC,InternetAddress.parse(toEmailId));
	}

	public void addRecipientsBCC(String bccEmailId, MimeMessage message) throws MessagingException, AddressException {
		message.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(bccEmailId));
	}

	private Session buildSession(final Properties properties) {
		LOGGER.info("fromemailid : " + properties.getProperty("fromemailid"));
		LOGGER.info("emailpwd : " + properties.getProperty("emailpwd"));
		final String fromemailid = properties.getProperty("fromemailid") != null ? properties.getProperty("fromemailid").trim() : "";
		final String emailpwd = properties.getProperty("emailpwd") != null ? properties.getProperty("emailpwd").trim() : "";
		Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(fromemailid, emailpwd);
			}
		});
		return session;
	}
	
	private Properties getMailProps(String hostname, String portno, String auth) {
		Properties properties = new Properties();
		properties.put("mail.smtp.host", hostname);
		properties.put("mail.smtp.socketFactory.port", portno);
		properties.put("mail.smtp.starttls.enable", "true");
		properties.put("mail.smtp.auth", auth);
		properties.put("mail.smtp.port", portno);
		return properties;
	}
}