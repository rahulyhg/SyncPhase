<?php
namespace App\Http\Controllers;

use File;

class App extends Controller
{
	public function app() {
		$template_files = File::files(base_path('resources/templates'));
		$templates = [];

		foreach ($template_files as $template_file) {
			$template = File::get($template_file);
			$templates[File::name($template_file)] = $template;
		}

		return view('app', [
			'templates' => $templates
		]);
	}
}