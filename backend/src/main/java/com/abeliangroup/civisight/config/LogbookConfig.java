package com.abeliangroup.civisight.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.zalando.logbook.Logbook;
import org.zalando.logbook.servlet.LogbookFilter;

@Configuration
public class LogbookConfig {

    @Bean
    public FilterRegistrationBean<LogbookFilter> logbookFilter(Logbook logbook) {
        FilterRegistrationBean<LogbookFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new LogbookFilter(logbook));
        registration.addUrlPatterns("/*");
        registration.setOrder(1);
        return registration;
    }
}
