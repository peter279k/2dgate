<?php

use Unirest\Request;

class HandleVideo {

    public function __construct ($videoLink) {
        $this->videoLink = $videoLink;
    }

    public function getVideoInfo () {
        $contents = $this->httpGet();

        $result = [];

        if ($contents === false) {
            return false;
        } else {
            
            phpQuery::newDocument($contents);
            $metaList = pq('meta');

            foreach ($metaList as $metaVal) {
                $property = pq($metaVal)->attr('property');
                $content = pq($metaVal)->attr('content');

                if ($property === 'og:url') {
                    $result['videoLink'] = $content;
                } else if ($property === 'og:image') {
                    $result['imageLink'] = $content;
                }
            }

            $scriptCode = pq('script');

            foreach ($scriptCode as $code) {

                if (strlen(pq($code)->html()) === 0) {
                    continue;
                }

                $jsCode = pq($code)->html().'';

                if (stristr($jsCode, 'CANONICAL_URL') !== false) {
                    $result['iniLinkCode'] = $jsCode;
                } else if (stristr($jsCode, 'eval') !== false) {
                    $result['evalCode'] = $jsCode;
                }
            }
        }

        return $result;
    }

    private function httpGet () {
        $response = Request::get($this->videoLink, [], []);

        if ($response->code > 200) {
            return false;
        }

        return $response->body;
    }
}
