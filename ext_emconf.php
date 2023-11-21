<?php

$EM_CONF[$_EXTKEY] = array(
    'title' => 'SLUB Web Sachsen.Digital',
    'description' => 'Extension for the website sachsen.digital',
    'category' => 'templates',
    'author' => 'SLUB Dresden',
    'author_email' => 'typo3@slub-dresden.de',
    'state' => 'beta',
    'internal' => '',
    'uploadfolder' => '0',
    'createDirs' => '',
    'clearCacheOnLoad' => 0,
    'version' => '3.0.0',
    'constraints' => array(
        'depends' => array(
            'typo3' => '9.5.0-10.4.99',
            'slub_content_elements' => '^0.0.1-1.0.0'
        ),
        'conflicts' => array(
        ),
        'suggests' => array(
        ),
    ),
);
