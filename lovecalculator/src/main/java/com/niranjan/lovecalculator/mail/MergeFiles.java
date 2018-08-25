package com.niranjan.lovecalculator.mail;

import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;

public class MergeFiles {
	public static byte[] merge(byte[] imagebytes, File waterMarkerFile) {
		byte[] mergedimageInByte = null;
		if (imagebytes != null && waterMarkerFile != null) {
			BufferedImage bImageFromConvert = null;
			try {
				InputStream in = new ByteArrayInputStream(imagebytes);
				bImageFromConvert = ImageIO.read(in);
			} catch (IOException e1) {
				System.out.println("Error occured while getting merging image:" + e1.getMessage());
			}
			ImageIcon icon = new ImageIcon(waterMarkerFile.getPath());
			BufferedImage bufferedImage = new BufferedImage(icon.getIconWidth(), icon.getIconHeight(),
					BufferedImage.TYPE_INT_RGB);

			Graphics graphics = bufferedImage.getGraphics();

			graphics.drawImage(bImageFromConvert, 0, 0, 555, 360, null);
			graphics.drawImage(icon.getImage(), 0, 0, null);

			graphics.dispose();

			ByteArrayOutputStream baos = new ByteArrayOutputStream();

			try {
				ImageIO.write(bufferedImage, "jpg", baos);
				baos.flush();
				mergedimageInByte = baos.toByteArray();
				baos.close();
			} catch (IOException e) {
				System.out.println("Error occured while merging two files :" + e.getMessage());
			}
		}
		return mergedimageInByte;
	}
}