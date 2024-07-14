/**
 * @file webs.c
 * @brief This file implements WebSocket functionalities for our blockchain network.
 * @version 0.1
 * @date 2024-07-14
 */

#include <libwebsockets.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int callback_websockets(struct libwebsocket_context *context, struct libwebsocket *wsi,
                               enum libwebsocket_callback_reasons reason, void *user, void *in, size_t len)
{
    switch (reason)
    {
    case LWS_CALLBACK_RECEIVE:
        // Handle received WebSocket messages
        libwebsocket_write(wsi, in, len, LWS_WRITE_TEXT);
        break;
    default:
        break;
    }
    return 0;
}

int main()
{
    struct libwebsocket_context *context;
    struct libwebsocket_protocols protocols[] = {
        {"http", callback_websockets, 0},
        {NULL, NULL, 0}};

    struct libwebsocket_context_creation_info info = {0};
    info.port = 8080;
    info.protocols = protocols;
    info.gid = -1;
    info.uid = -1;

    context = libwebsocket_create_context(&info);
    if (context == NULL)
    {
        fprintf(stderr, "Error creating WebSocket context\n");
        return EXIT_FAILURE;
    }

    printf("WebSocket server started on port 8080\n");

    while (1)
    {
        libwebsocket_service(context, 100);
    }

    libwebsocket_context_destroy(context);
    return 0;
}