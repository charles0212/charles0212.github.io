// algolia instant search
function search() {
  // 搜索配置
  const algoliaConfig = document.querySelector('meta[property="algolia:search"]').dataset;
  const search = instantsearch({
    indexName: algoliaConfig.indexName,
    searchClient: algoliasearch(algoliaConfig.applicationId, algoliaConfig.apiKey),
  });

  search.addWidgets([
    instantsearch.widgets.configure({
      hitsPerPage: 5,
    })
  ]);

  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-box',
      placeholder: '关键字搜索',
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: `
        <article class="post post-type">
          <header class="post-header">
              <h3 class="post-title">
                  <a class="list-item" target="_blank" href="{{permalink}}">
                      {{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}
                  </a>
              </h3>
          </header>
          <div class="post-body hit-description">
              {{#helpers.highlight}}{ "attribute": "excerpt" }{{/helpers.highlight}}
          </div>
          <footer class="post-meta">
              <span class="post-category">
                  <a class="read-more float-right mr-3" target="_blank" href="{{permalink}}">
                      继续阅读
                  </a>
              </span>
          </footer>
        </article>
      `,
      },
      cssClasses: {
        item: 'posts-collapse'
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination',
    })
  );

  search.start();
}

$(function () {
  search();
});
