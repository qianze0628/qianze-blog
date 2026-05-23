package com.qianze.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtFilter implements Filter {
    private final JwtUtil jwt;

    public JwtFilter(JwtUtil jwt) { this.jwt = jwt; }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        String auth = request.getHeader("Authorization");

        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            if (jwt.validate(token)) {
                request.setAttribute("jwtValid", true);
                String role = jwt.getRole(token);
                if (role != null) request.setAttribute("jwtRole", role);
            }
        }
        chain.doFilter(req, res);
    }
}
