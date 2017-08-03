FROM scratch

COPY data /data
COPY eq-survey-register /

EXPOSE 8080

ENTRYPOINT ["/eq-survey-register"]