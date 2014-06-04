var FMEX = {
    _hasStorage: (function() {
        // Detect localStorage
        var uid = new Date,
            result;
        try {
            localStorage.setItem(uid, uid);
            result = localStorage.getItem(uid) == uid;
            localStorage.removeItem(uid);
            return result && localStorage;
        } catch (e) {}
    }()),
    Services: {
        ServiceHost: '54.205.64.78',
        //ServiceHost: '10.211.55.3',

        // Given an object, create a query parameters list from the KVPs in the object
        AppendQueryParams: (function(params) {
            var queryParams = '';
            var first = true;

            for (var param in params) {
                if (params.hasOwnProperty(param)) {
                    queryParams += (first ? '' : '&') + param + '=' + params[param];
                    first = false;
                }
            }

            return queryParams === '' ? '' : '?' + queryParams;
        }),

        // Return a web service URL
        WebServiceURL: (function(port, resource, limits, append) {
            var params = {};

            var doAppend = (typeof append === 'undefined') ? true : append;
            if (doAppend === true) {
                params = FMEX.Session.appendParam(params);
            }

            if (typeof limits !== 'undefined') {
                if (limits.hasOwnProperty('limit') && limits.hasOwnProperty('offset')) {
                    params.limit = limits.limit;
                    params.offset = limits.offset;
                }
            }

            return 'http://' + FMEX.Services.ServiceHost + ':' + port + '/' + resource +
                FMEX.Services.AppendQueryParams(params);
        }),

        Contracts : {
            Tags: {
                Create: function(cluster) {
                    var clusterId = -1;
                    $.ajax(FMEX.Services.WebServiceURL('8081', 'tags'), {
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: '{"tags" : ' + cluster + '}',
                        async: false,
                        success: function(response) {
                            clusterId = response.clusterId;
                        }
                    });
                    return clusterId;
                },
                UserGet: function() {
                    var result
                    $.ajax(FMEX.Services.WebServiceURL('8081', 'tags/user'), {
                        type: 'GET',
                        dataType: 'json',
                        async: false,
                        success: function(response) {
                            result = response.tags;
                        }
                    });
                    return result;
                },
                UserPost: function(name, tags) {
                    $.ajax(FMEX.Services.WebServiceURL('8081', 'tags/user'), {
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json',
                        async: false,
                        data: JSON.stringify({
                            name: name,
                            tags: JSON.stringify(tags)
                        }),
                        success: function(response) {

                        }
                    });
                }
            }
        },

        Auth: {
            Login: function(username, password) {
                var response;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'auth/login'), {
                    type: 'POST',
                    async: false,
                    dataType: 'json',
                    data: JSON.stringify({
                        userName: username,
                        password: password
                    }),
                    contentType: 'application/json',
                    success: function(data) {
                        response = {
                            accepted: true,
                            secret: data.secret,
                            name: data.firstName
                        };
                    },
                    error: function(data, status) {
                        response = {
                            accepted: false,
                            message: data.responseJSON.message
                        };
                    }
                });
                return response;
            },

            Logout : function() {
                var response;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'auth/logout'), {
                    type: 'GET',
                    async: false,
                    complete: function(data) {
                        response = {
                            accepted: true
                        };
                        localStorage.setItem('flash', 'You have been successfully logged out.');
                        window.location = 'login';
                    },
                    error: function(data, status) {
                        response = {
                            accepted: false
                        };
                    }
                });
                return response;
            },

            SignUp: function(username, password, firstname, lastname, email) {
                var response;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'auth/user'), {
                    type: 'POST',
                    async: false,
                    data: JSON.stringify({
                        userName: username,
                        password: password,
                        firstName: firstname,
                        lastName: lastname,
                        email: email
                    }),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(data) {
                        response = {
                            accepted: true
                        };
                    },
                    error: function(data, status) {
                        response = {
                            accepted: false,
                            message: data.responseJSON.message
                        };
                    }
                });
                return response;
            },

            Profile : function() {
                var response;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'auth/whoami'), {
                    type: 'GET',
                    async: false,
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(data) {
                        response = {
                            accepted: true,
                            firstName : data.first_name,
                            lastName : data.last_name,
                            username : data.user_name,
                            email : data.email
                        };
                    },
                    error: function(data, status) {
                        response = {
                            accepted: false,
                            message: data.responseJSON.message
                        };
                    }
                });
                return response;
            }
        },

        File: {

            download: function(orderId) {
                var url = FMEX.Services.WebServiceURL('8090', 'file/' + orderId);
                window.location = url;
            },

            send: function(data) {
                var response;
                $.ajax(FMEX.Services.WebServiceURL('8090', 'file'), {
                    type: 'POST',
                    data: data,
                    async: false,
                    cache: false,
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    success: function(data, textStatus, jqXHR) {
                        response = {
                            accepted: 1,
                            fileId: data.fileId
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        response = {
                            accepted: 0
                        }
                    }
                });
                return response;
            },
        },

        Ims: {
            GetRfq: function(rfqId) {
                var rfq = false;

                $.ajax(FMEX.Services.WebServiceURL('8081', 'ims/rfq/' + rfqId), {
                    type: 'GET',
                    contentType: 'application/json',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        rfq = new Auction({
                            rfqIds : [response.rfq_id],
                            tags : response.tag_combo,
                            tagId : response.tag_id,
                            tagCombo : response.tag_combo,
                            description : FMEX.Tags.PrettyPrint(response.tag_combo),
                            flightStart : response.flight_start,
                            flightEnd : response.flight_end,
                            accountId : response.account_id,
                            accountName : response.account_name,
                            accountOrder : response.account_order,
                            whitelistId : response.whitelist_id,
                            contraValue : response.contra_name,
                            side : response.side,
                            type : response.type,
                            media : response.media,
                            hostAccountId : response.host_account_id,
                            hostAccountName : response.host_account_name,
                            hostBudget : response.host_budget,
                            timestamp : response.timestamp
                        });
                    },
                    error: function() {

                    }
                });

                return rfq;
            },
            GetRfqs: function(accountIds, sort) {
                var rfqs = {};
                $.ajax(FMEX.Services.WebServiceURL('8081', 'ims/rfq'), {
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        accountIds: accountIds,
                        sort: sort
                    }),
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        rfqs = response;
                    },
                    error: function() {

                    }
                });
                return rfqs;
            },
            GetTrades: function(accountIds, sort) {
                var trades = [];
                $.ajax(FMEX.Services.WebServiceURL('8081', 'ims/trade'), {
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        accountIds: accountIds,
                        sort: sort
                    }),
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        trades = response;
                    },
                });
                return trades;
            },
            GetOrder : function(orderId) {
                var order = null;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'ims/order/' + orderId), {
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        order = new Auction({
                            orderId : orderId,
                            rfqIds : [response.rfq_id],
                            tags : response.tag_combo,
                            tagId : response.tag_id,
                            tagCombo : response.tag_combo,
                            description : FMEX.Tags.PrettyPrint(response.tag_combo),
                            flightStart : response.flight_start,
                            flightEnd : response.flight_end,
                            accountId : response.account_id,
                            accountName : response.account_name,
                            whitelistId : response.whitelist_id,
                            contraValue : response.contra_name,
                            side : response.side,
                            type : response.type,
                            media : response.media,
                            price : response.price,
                            volume : response.volume,
                            hostAccountId : response.host_account_id,
                            hostAccountName : response.host_account_name,
                            hostBudget : response.host_budget,
                            comment : response.comment,
                            annotation : response.annotation,
                            timestamp : response.timestamp
                        });
                    },
                });
                return order;
            },
            GetOrders : function(accountIds, sort, filter) {
                var orders = [];
                $.ajax(FMEX.Services.WebServiceURL('8081', 'ims/order'), {
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        accountIds: accountIds,
                        sort: sort,
                        filter: filter
                    }),
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        orders = response.orders;
                    },
                });
                return orders;
            }

        },

        Campaign: {
            Create: function(name, budget, accountId, side) {
                var campaignId;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'oms/campaign'), {
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    async: false,
                    data: JSON.stringify({
                        name: name,
                        budget: budget,
                        accountId: accountId,
                        side: side
                    }),
                    success: function(response) {
                        campaignId = response.id;
                    }
                });
                return campaignId;
            },
            List: function(accountIds) {
                var campaigns = [];
                $.ajax(FMEX.Services.WebServiceURL('8081', 'ims/campaign'), {
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        accountIds: accountIds
                    }),
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        campaigns = response.campaigns;
                    },
                });
                return campaigns;
            },
            Get : function(campaignId) {
                var campaign = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'ims/campaign/' + campaignId), {
                    type: 'GET',
                    contentType: 'application/json',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        campaign = [];

                        for (var r in response.rfqs) {
                            var rfq = response.rfqs[r];
                            campaign.push(new Auction({
                                accountId : rfq.account_id,
                                accountName : rfq.account_name,
                                accountOrder : rfq.account_order,
                                contraValue : rfq.contra_name,
                                flightStart : rfq.flight_start,
                                flightEnd : rfq.flight_end,
                                rfqIds : [rfq.rfq_id],
                                side : rfq.side,
                                tagId : rfq.tag_id,
                                tags : rfq.tag_combo,
                                description : FMEX.Tags.PrettyPrint(rfq.tag_combo),
                                type : rfq.type,
                                media : rfq.media,
                                hostAccountId : rfq.host_account_id,
                                hostAccountName : rfq.host_account_name,
                                hostBudget : rfq.host_budget,
                                whitelistId : rfq.whitelist_id,
                                // TODO: THIS COMMENT BREAKS THE CAMPAIGN MOD SCREEN
                                //price : rfq.host_order.price,
                                //volume : rfq.host_order.volume,
                                //orderId : rfq.host_order.order_id,
                                timestamp : rfq.timestamp
                            }));
                        }
                    },
                });
                return campaign;
            }
        },

        Orders: {
            Send: function(orderParams) {
                if (orderParams.type == 'biddable') {
                    if (orderParams.price < 0.01 || orderParams.volume < 1000) {
                        return {
                            accepted: false,
                            message: "Order must be for at least $0.01 and 1,000 impressions"
                        };
                    }
                }
                var rfqIds = [];
                if (undefined !== orderParams.rfqIds) {
                    rfqIds = orderParams.rfqIds.map(function(id) {
                        return parseInt(id);
                    });
                }

                var clusterId = orderParams.tagId;
                if (true === orderParams.local) {
                    // Look up the cluster ID (or create a new cluster if needed)
                    clusterId = FMEX.Services.Contracts.Tags.Create(JSON.stringify(orderParams.tags));
                    if (clusterId == -1) {
                        return false;
                    }
                }

                var status;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'oms/order'), {
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    async: false,
                    data: JSON.stringify({
                        account: parseInt(orderParams.accountId),
                        volume: parseFloat(orderParams.volume),
                        price: (orderParams.type == "biddable" ? parseFloat(orderParams.price) : 1.0),
                        side: orderParams.side,
                        type: orderParams.type,
                        media: orderParams.media,
                        tags: parseInt(clusterId),
                        flightDateRange: {
                            start: orderParams.flightStart,
                            end: orderParams.flightEnd
                        },
                        annotation: orderParams.annotation,
                        comment: orderParams.comment,
                        campaignId : orderParams.campaignId,
                        whitelistId: orderParams.whitelistId,
                        rfqIds: rfqIds,
                    }),
                    success: function(response) {
                        status = {
                            accepted: true,
                            orderId: response.orderId
                        };
                    },
                    error: function(response) {
                        status = {
                            accepted: false,
                            message: response.responseJSON.message
                        };
                    }
                });
                return status;
            },

            CancelOrder: function(orderId) {
                var result = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'oms/order/' + orderId), {
                    type: 'DELETE',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        result = true;
                    }
                });
                return result;
            },

            Modify: function(orderParams) {
                var status;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'oms/order'), {
                    type: 'PATCH',
                    contentType: 'application/json',
                    dataType: 'json',
                    async: false,
                    data: JSON.stringify({
                        account: parseInt(orderParams.accountId),
                        orderId: orderParams.orderId,
                        volume: parseFloat(orderParams.volume),
                        price: (orderParams.type == "biddable" ? parseFloat(orderParams.price) : 1.0),
                        annotation: orderParams.annotation,
                        rfqIds: orderParams.rfqIds,
                    }),
                    success: function(response) {
                        status = {
                            accepted: 1
                        };
                    },
                    error: function(response) {
                        status = {
                            accepted: 0,
                            message: "Failure to Modify Order"
                        };
                    }
                });
                return status;
            },

            AcceptOrder: function(rfqId, orderId) {
                var result = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'oms/rfq/' + rfqId + '/accept/' + orderId), {
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        result = true;
                    }
                });
                return result;
            },

            RejectOrder: function(rfqId, orderId) {
                var result = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'oms/rfq/' + rfqId + "/reject/" + orderId), {
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        result = true;
                    }
                });
                return result;
            },

            RateOrder: function (rfqId, orderId, rating) {
                var result = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'oms/order/' + orderId + '/rating'), {
                    type: 'PATCH',
                    contentType: 'application/json',
                    dataType: 'json',
                    async: false,
                    data: JSON.stringify({
                        rfqId: parseInt(rfqId),
                        score: parseInt(rating)
                    }),
                    success: function(response) {
                        result = true;
                    }
                });
                return result;
            },

            Comment: function(rfqId, orderId, comment) {
                var result = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'oms/rfq/' + rfqId + "/comment/" + orderId), {
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({comment: comment}),
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        result = true;
                    }
                });
                return result;
            },

            CancelRFQ: function(rfqId) {
                var result = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'oms/rfq/' + rfqId), {
                    type: 'DELETE',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        result = true;
                    }
                });
                return result;
            },

            UnsubscribeRFQ: function(accountId, rfqId) {
                var result = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'oms/rfq/' + rfqId + '/subscriber/' + accountId), {
                    type: 'DELETE',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        result = true;
                    }
                });
                return result;
            },

            attach: function(orderId, fileId) {
                var accepted = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'oms/order/' + orderId + '/file/' + fileId), {
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        accepted = true;
                    }
                });
                return accepted;
            },

        },

        MarketData: {
            Stream: function() {
                return 'ws://' + FMEX.Services.ServiceHost + ':8087';
            }
        },

        Whitelist: {
            GetForAccount: function(accountId) {
                var whitelists = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'wls/account/' + accountId), {
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        whitelists = response;
                    }
                });
                return whitelists;
            },
            Get: function(whitelistId) {
                var whitelist = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'wls/' + whitelistId), {
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        whitelist = response;
                    },
                });
                return whitelist;
            },
            Create: function(whitelistDesc) {
                var result = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'wls'), {
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(whitelistDesc),
                    async: false,
                    success: function(response) {
                        result = {
                            id: response.id,
                            status: true
                        };
                    },
                    error: function(xhr, source, what) {
                        result = {
                            message: 'Failed to create whitelist: ' + what,
                            status: false
                        }
                    }
                });
                return result;
            },
            Update: function(whitelistDesc, whitelistId) {
                var result = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'wls/' + whitelistId), {
                    type: 'PATCH',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(whitelistDesc),
                    async: false,
                    success: function(response) {
                        result = true;
                    },
                    error: function(xhr, source, what) {
                        result = false;
                    }
                });
                return result;
            },
            Delete: function(whitelistId) {
                var result = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'wls/' + whitelistId), {
                    type: 'DELETE',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        result = true;
                    },
                    error: function(xhr, source, what) {
                        result = false;
                    }
                });

                return result;
            },
            AddWanted: function(wantedDesc) {
                var result = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'wls/want'), {
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(wantedDesc),
                    async: false,
                    success: function(response) {
                        result = true;
                    },
                    error: function(xhr, source, what) {
                        result = false;
                    }
                });
                return result;
            },
        },

        Account: {
            Get: function() {
                var accounts = false;
                $.ajax(FMEX.Services.WebServiceURL('8081', 'acct'), {
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        accounts = response;
                    }
                });
                return accounts;
            },
            GetIds: function() {
                var ids = [];
                var accounts = this.Get();
                for (var account in accounts) {
                    ids.push(accounts[account].id);
                }
                return ids;
            },
            GetWhitelistInfo: function(accountId) {
                var accounts = false;

                $.ajax(FMEX.Services.WebServiceURL('8081', 'acct/whitelist/' + accountId), {
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        accounts = response;
                    },
                    error: function(xhr, where, how) {

                    }
                });

                return accounts;
            },
        },

        Message: {
            init: function() {
                this.$el = $('.notifications');
                this.refresh();
            },
            refresh: function() {
                $.ajax(FMEX.Services.WebServiceURL('8081', '/message'), {
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        status: ['unread']
                    }),
                    dataType: 'json',
                    async: true,
                    success: function(messages) {
                        FMEX.Services.Message.render(messages);
                        setTimeout(FMEX.Services.Message.refresh, 5 * 1000);
                    },
                });
            },
            render: function(messages) {
                if (messages.length > 0) {
                    this.$el.find('span').show();
                } else {
                    this.$el.find('span').hide();
                }
                this.$el.find('span').html(messages.length || 0);
            }
        }
    },

    // Cached account state
    Accounts: {
        list: {},
        listeners: null,

        init: function() {
            this.list = FMEX.Services.Account.Get();
            this.listeners = EventListener.newNotifier();
        },

        // Re-retrieve the list from the server and notify all listeners
        update: function() {
            this.list = FMEX.Services.Account.Get();
            this.listeners.notifyEvent(this.list);
        },

        // Add an event to listen for updates to the account list
        addListener: function(lambda, id) {
            return this.listeners.addListener(id, lambda);
        },

        // Delete a listener
        delListener: function(id) {
            return this.listeners.rmListener(id);
        },

        // Apply a funciton for each account
        forEach: function(lambda) {
            var id;

            for (id in this.list) {
                if (!this.list.hasOwnProperty(id)) {
                    continue;
                }

                lambda(this.list[id]);
            }
        },

        findById: function(accountId) {
            var id;

            for (id in this.list) {
                if (!this.list.hasOwnProperty(id)) {
                    continue;
                }
                var account = this.list[id];
                if (accountId === account.id) {
                    return account;
                }
            }

            return false;
        },
    },

    Session: {
        key: 's',
        getParam: function() {
            return '?' + this.key + '=' + localStorage.getItem(this.key);
        },
        // Add the query parameter to the given object as a kvp
        appendParam: function(params) {
            params[this.key] = localStorage.getItem(this.key);
            return params;
        },
        clear: function() {
            localStorage.removeItem(this.key);
        },
        check: function() {
            if (!FMEX._hasStorage || !this.get()) {
                localStorage.setItem('flash', 'Your session has expired.  Please log in again.');
                window.location = 'login';
            }
        },
        get: function() {
            return localStorage.getItem(this.key);
        },
        set: function(token) {
            localStorage.setItem(this.key, token);
            return token;
        },
        getName: function() {
            return localStorage.getItem('n');
        },
        setName: function(token) {
            localStorage.setItem('n', token);
            return token;
        },
        display: function() {
            var el = $('.top_header .username');
            el.text(this.getName());
        }
    },

    Auctions: {
        save: function(auctions) {
            var save = [];
            for (var a in auctions) {
                save.push(auctions[a].serialize());
            }
            localStorage.setItem('auctions', JSON.stringify(save));
        },
        get: function() {
            var savedAuctions = localStorage.getItem('auctions');
            if (!savedAuctions) return [];
            savedAuctions = JSON.parse(savedAuctions);

            var auctions = [];
            for (var a in savedAuctions) {
                auctions.push(new Auction(savedAuctions[a]));
            }

            return auctions;
        },
        clear : function() {
            localStorage.removeItem('auctions');
        }
    },

    Tags : {

        PrettyPrint : function(cluster) {
            var buffer;
            var that = this;
            $.each(cluster, function(key, value) {
                if (typeof(buffer) != "undefined") {
                    buffer += ', ';
                    if ($.isArray(value)) {
                        buffer += that.PrettyPrint(value);
                    } else {
                        buffer += value.capitalize();;
                    }
                } else {
                    if ($.isArray(value)) {
                        buffer = that.PrettyPrint(value);
                    } else {
                        buffer = value.capitalize();
                    }
                }
            });
            return buffer;
        },

        PrettyPrintList : function(cluster) {
            var that = this;

            var buffer = "<ul>";
            $.each(cluster, function(key, value) {
                buffer += "<li>";
                if ($.isArray(value)) {
                    buffer += that.PrettyPrint(value);
                } else {
                    buffer += value.capitalize();;
                }
                buffer += "</li>";
            });
            buffer += "</ul>";
            return buffer;
        }

    },
    UI : {
        init : function() {
            this.fitWindow();
            $(window).resize(this.fitWindow);
        },
        fitWindow : function() {
            // Stretch content to fill screen
            var h = $(document).height() - $('.top_header').height() - 6;
            if ($('.login').length == 0) {
                $('.content > .wrap > aside.left').css('height',h+'px');
                $('.content > .wrap > main, .content > .wrap > aside.right').css('height',h-40+'px');
            };
        }
    }

};


$(document).ready(function() {
    FMEX.Accounts.init();
    FMEX.UI.init();
});
