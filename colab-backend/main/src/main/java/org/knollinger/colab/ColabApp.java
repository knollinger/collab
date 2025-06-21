package org.knollinger.colab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class ColabApp {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		SpringApplication.run(ColabApp.class, args);
	}

	/**
	 * @return
	 */
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**") //
						.allowedOriginPatterns("**") //
						.allowCredentials(true) //
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD");
			}
		};
	}

}
