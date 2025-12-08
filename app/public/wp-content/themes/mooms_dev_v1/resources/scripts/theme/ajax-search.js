/**
 * AJAX Live Search
 * Handles real-time search functionality
 */

(function($) {
    'use strict';
    
    $(document).ready(function() {
        const $searchInput = $('#search-input');
        const $searchResults = $('.modal-body .search-results');
        let searchTimeout;
        
        if (!$searchInput.length) {
            return;
        }
        
        /**
         * Debounced search handler
         */
        $searchInput.on('input', function() {
            const searchQuery = $(this).val().trim();
            
            // Clear previous timeout
            clearTimeout(searchTimeout);
            
            // Clear results if query is too short
            if (searchQuery.length <= 2) {
                $searchResults.html('');
                return;
            }
            
            // Debounce search request
            searchTimeout = setTimeout(function() {
                performSearch(searchQuery);
            }, 300); // Wait 300ms after user stops typing
        });
        
        /**
         * Perform AJAX search
         */
        function performSearch(query) {
            $.ajax({
                url: window.mmsData?.ajaxurl || ajaxurl,
                type: 'GET',
                data: {
                    action: 'ajax_search',
                    s: query
                    // nonce: window.mmsData?.nonce // Uncomment when nonce is implemented
                },
                beforeSend: function() {
                    $searchResults.html('<div class="search-loading">Đang tìm kiếm...</div>');
                },
                success: function(response) {
                    $searchResults.html(response);
                },
                error: function(xhr, status, error) {
                    console.error('Search error:', error);
                    $searchResults.html('<div class="search-error">Có lỗi xảy ra. Vui lòng thử lại.</div>');
                }
            });
        }
        
        // Clear search on modal close
        $(document).on('hidden.bs.modal', '#searchModal', function() {
            $searchInput.val('');
            $searchResults.html('');
        });
    });
    
})(jQuery);
