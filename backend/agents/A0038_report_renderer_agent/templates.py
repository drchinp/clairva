"""
File: app/agents/A0038_report_renderer_agent/templates.py

Purpose:
HTML templates for rendering report sections.
"""

HERO_TEMPLATE = """
<section class="hero">
<h1>{title}</h1>
<p>{subtitle}</p>
</section>
"""


SUMMARY_TEMPLATE = """
<section class="summary">
<h2>Executive Summary</h2>
<p>{content}</p>
</section>
"""


CARD_TEMPLATE = """
<div class="card">
<h3>{title}</h3>
<p>{description}</p>
</div>
"""