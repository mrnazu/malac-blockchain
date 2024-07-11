/**
 * @file rpc.c
 * @author Samuel (nazu.discorde@gmail.com)
 * @brief This code implements the RPC functionality for our blockchain network using Node-API.
 * @version 0.1
 * @date 2024-07-11
 *
 * @copyright Copyright (c) 2024
 *
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <node_api.h>

napi_value RPC_GetBlockchain(napi_env env, napi_callback_info info);
napi_value RPC_CreateTransaction(napi_env env, napi_callback_info info);
napi_value RPC_HTTP_GetBlockchain(napi_env env, napi_callback_info info);

napi_value Init(napi_env env, napi_value exports)
{
    napi_status status;

    // Register RPC_GetBlockchain function
    status = napi_create_function(env, NULL, 0, RPC_GetBlockchain, NULL, NULL);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Failed to create RPC_GetBlockchain function");
    }
    status = napi_set_named_property(env, exports, "getBlockchain", RPC_GetBlockchain);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Failed to set named property getBlockchain");
    }

    // Register RPC_CreateTransaction function
    status = napi_create_function(env, NULL, 0, RPC_CreateTransaction, NULL, NULL);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Failed to create RPC_CreateTransaction function");
    }
    status = napi_set_named_property(env, exports, "createTransaction", RPC_CreateTransaction);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Failed to set named property createTransaction");
    }

    // Register RPC_HTTP_GetBlockchain function
    status = napi_create_function(env, NULL, 0, RPC_HTTP_GetBlockchain, NULL, NULL);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Failed to create RPC_HTTP_GetBlockchain function");
    }
    status = napi_set_named_property(env, exports, "getHttpBlockchain", RPC_HTTP_GetBlockchain);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Failed to set named property getHttpBlockchain");
    }

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)

// Example function to be called from Node.js
napi_value RPC_GetBlockchain(napi_env env, napi_callback_info info)
{
    napi_value blockchainData;
    napi_status status = napi_create_string_utf8(env, "Blockchain data fetched!", NAPI_AUTO_LENGTH, &blockchainData);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Failed to create blockchain data string");
    }
    return blockchainData;
}

// Example function to be called from Node.js
napi_value RPC_CreateTransaction(napi_env env, napi_callback_info info)
{
    napi_value result;
    napi_status status = napi_create_string_utf8(env, "Transaction created!", NAPI_AUTO_LENGTH, &result);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Failed to create transaction result string");
    }
    return result;
}

// Example function to be called from Node.js
napi_value RPC_HTTP_GetBlockchain(napi_env env, napi_callback_info info)
{
    napi_value httpResponse;
    napi_status status = napi_create_string_utf8(env, "HTTP response: Blockchain data fetched!", NAPI_AUTO_LENGTH, &httpResponse);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Failed to create HTTP response string");
    }
    return httpResponse;
}