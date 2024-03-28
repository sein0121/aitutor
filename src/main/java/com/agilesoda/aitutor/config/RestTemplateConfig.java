package com.agilesoda.aitutor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;

@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate(){

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();

        HttpClient httpClient = HttpClientBuilder.create()
                .setMaxConnTotal(100)
                .setMaxConnPerRoute(50)
                .build();

        factory.setHttpClient(httpClient);
        factory.setConnectTimeout(3600*1000);
        factory.setReadTimeout(3600*1000);
        factory.setConnectionRequestTimeout(3600*1000);

        return  new RestTemplate(factory);
    }
}
