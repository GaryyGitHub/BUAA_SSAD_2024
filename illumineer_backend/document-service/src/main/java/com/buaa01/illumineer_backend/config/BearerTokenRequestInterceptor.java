package com.buaa01.illumineer_backend.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class BearerTokenRequestInterceptor implements RequestInterceptor {
    private static final Pattern BEARER_TOKEN_HEADER_PATTERN = Pattern.compile("^Bearer (?<token>[a-zA-Z0-9-._~+/]+=*)$",
            Pattern.CASE_INSENSITIVE);

    @Override
    public void apply(RequestTemplate template) {
//        final String authorization = HttpHeaders.AUTHORIZATION;
//        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
//        if (Objects.nonNull(requestAttributes)) {
//            String authorizationHeader = requestAttributes.getRequest().getHeader(HttpHeaders.AUTHORIZATION);
//            if (Objects.nonNull(authorizationHeader)){
//                Matcher matcher = BEARER_TOKEN_HEADER_PATTERN.matcher(authorizationHeader);
//                if (matcher.matches()) {
//                    // 清除token头 避免传染
//                    template.header(authorization);
//                    template.header(authorization, authorizationHeader);
//                }
//            }
//        }
        template.removeHeader("Authorization");
    }
}